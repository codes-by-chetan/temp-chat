// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const os = require("os");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// --- Logging setup (keeps what you had) ---
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} - ${level.toUpperCase()} - ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

// --- App & server ---
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve static public folder (expects public/index.html)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/keep-alive", (req, res) => {
  // No body, no auth – just a tiny HTTP response
  res.status(200).json({ alive: true, ts: Date.now() });
  logger.info(`Keep-alive ping received (IP: ${req.ip})`);
});

// In-memory rooms: Map<roomId, { passkey: string|null, clients: Map<socketId, username> }>
const rooms = new Map();

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Send initial connected state
  socket.emit("state", { step: "connected" });

  // Host a room request: { private: boolean, passkey?: string }
  socket.on("hostRoom", (payload) => {
    try {
      const passkey =
        payload && payload.private ? payload.passkey || null : null;
      const roomId = uuidv4();
      rooms.set(roomId, { passkey, clients: new Map() });

      // Put creator in a transient state until they set a username
      socket.data.roomId = roomId;
      socket.data.step = "awaiting-username";

      // Structured event: room created
      socket.emit("roomCreated", {
        roomId,
        passkeyRequired: !!passkey,
        message: "Room created. Please set your username.",
      });

      logger.info(
        `Room ${roomId} created (private=${!!passkey}) by ${socket.id}`
      );
    } catch (err) {
      logger.error(`hostRoom error: ${err.message}`);
      socket.emit("error", { message: "Unable to create room" });
    }
  });

  // Join a room request: { roomId, passkey? }
  socket.on("joinRoom", (payload) => {
    try {
      if (!payload || !payload.roomId) {
        socket.emit("error", { message: "Missing roomId" });
        return;
      }
      const roomId = payload.roomId;

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("error", { message: "Room does not exist" });
        return;
      }
      if (room.passkey && !payload.passkey) {
        socket.emit("needPasskey", {
          roomId,
          message: "Passkey required to join this room",
        });
        return;
      }
      if (room.passkey && room.passkey !== payload.passkey) {
        socket.emit("error", { message: "Invalid passkey" });
        return;
      }

      // store on socket that they are joining and need to provide username
      socket.data.roomId = roomId;
      socket.data.step = "awaiting-username";

      socket.emit("needUsername", {
        roomId,
        message: "Enter username to join",
      });
    } catch (err) {
      logger.error(`joinRoom error: ${err.message}`);
      socket.emit("error", { message: "Unable to join room" });
    }
  });

  // Set username: { username }
  socket.on("setUsername", (payload) => {
    try {
      if (!payload || !payload.username) {
        socket.emit("error", { message: "Username cannot be empty" });
        return;
      }

      const username = String(payload.username).trim();
      const roomId = socket.data.roomId;

      if (!roomId || !rooms.has(roomId)) {
        socket.emit("error", { message: "Room not found or expired" });
        return;
      }

      const room = rooms.get(roomId);

      // Check for duplicate username in the same room (case-insensitive)
      const isDuplicate = Array.from(room.clients.values()).some(
        (name) => name.toLowerCase() === username.toLowerCase()
      );

      if (isDuplicate) {
        socket.emit("needUsername", {
          roomId,
          message: "Username already in use, choose a different one",
        });
        return;
      }

      // Save username and join socket room
      room.clients.set(socket.id, username);
      socket.join(roomId);
      socket.data.step = "chat";

      // Notify everyone in room
      const joinMsg = {
        from: "system",
        text: `*** ${username} joined the chat ***`,
        timestamp: Date.now(),
      };
      io.to(roomId).emit("chatMessage", joinMsg);

      socket.emit("joinedRoom", {
        roomId,
        username,
        message: "Connection successful. Welcome!",
      });

      logger.info(`Socket ${socket.id} as ${username} joined room ${roomId}`);
    } catch (err) {
      logger.error(`setUsername error: ${err.message}`);
      socket.emit("error", { message: "Unable to set username" });
    }
  });

  // Send chat message: { text, repliedTo? }
  socket.on("sendMessage", (payload) => {
    try {
      if (!payload || !payload.text) return;
      const roomId = socket.data.roomId;
      if (!roomId || !rooms.has(roomId)) {
        socket.emit("error", { message: "Not in a room" });
        return;
      }
      const room = rooms.get(roomId);
      const username = room.clients.get(socket.id);
      if (!username) {
        socket.emit("error", { message: "Username not set" });
        return;
      }

      const msg = {
        messageId: uuidv4(),  // Server-generated unique ID
        from: username,
        text: String(payload.text),
        timestamp: Date.now(),
        repliedTo: payload.repliedTo || null  // Full message object from frontend
      };

      io.to(roomId).emit("chatMessage", msg);
      logger.info(`Message from ${username} in ${roomId}: ${payload.text}`);
    } catch (err) {
      logger.error(`sendMessage error: ${err.message}`);
      socket.emit("error", { message: "Unable to send message" });
    }
  });

  // Quit event (client leaving intentionally)
  socket.on("quit", () => {
    try {
      const roomId = socket.data.roomId;
      if (roomId && rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const username = room.clients.get(socket.id);
        if (username) {
          room.clients.delete(socket.id);
          io.to(roomId).emit("chatMessage", {
            from: "system",
            text: `*** ${username} left the chat ***`,
            timestamp: Date.now(),
          });
          logger.info(`${username} quit room ${roomId}`);
          if (room.clients.size === 0) {
            rooms.delete(roomId);
            logger.info(`Room ${roomId} deleted (empty)`);
          }
        }
      }
      socket.leave(socket.data.roomId || "");
      socket.data.step = "disconnected";
      socket.disconnect(true);
    } catch (err) {
      logger.error(`quit error: ${err.message}`);
    }
  });

  socket.on("disconnect", (reason) => {
    // Clean up membership
    try {
      const roomId = socket.data.roomId;
      if (roomId && rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const username = room.clients.get(socket.id);
        if (username) {
          room.clients.delete(socket.id);
          io.to(roomId).emit("chatMessage", {
            from: "system",
            text: `*** ${username} left the chat ***`,
            timestamp: Date.now(),
          });
          logger.info(
            `${username} disconnected from ${roomId} (reason: ${reason})`
          );
          if (room.clients.size === 0) {
            rooms.delete(roomId);
            logger.info(`Room ${roomId} deleted (empty)`);
          }
        }
      }
      logger.info(`Socket disconnected: ${socket.id} (reason: ${reason})`);
    } catch (err) {
      logger.error(`disconnect cleanup error: ${err.message}`);
    }
  });
});

// Utility to get local IP for logging
function getServerIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  const ip = getServerIp();
  logger.info(`Server listening on http://${ip}:${PORT}`);
});

process.on("SIGINT", () => {
  logger.info("Shutting down server...");
  for (const roomId of rooms.keys()) {
    io.to(roomId).emit("chatMessage", {
      from: "system",
      text: "*** Server is shutting down ***",
      timestamp: Date.now(),
    });
  }
  io.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});