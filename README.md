# TempChat

<picture>
  <source 
    media="(prefers-color-scheme: dark)" 
    srcset="https://temp-chat-nqzf.onrender.com/temp-chat-logo-cropped.png"
    onerror="this.onerror=null;this.srcset='https://cdn.jsdelivr.net/gh/codes-by-chetan/Images_Server@main/temp-chat-logo-cropped.png';"
  >
  <img 
    src="https://temp-chat-nqzf.onrender.com/temp-chat-logo-cropped-dark.png" 
    alt="TempChat Logo" 
    onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/gh/codes-by-chetan/Images_Server@main/temp-chat-logo-cropped-dark.png';"
  >
</picture>

**TempChat** is a **fully ephemeral, real-time chat application** designed for temporary conversations. Rooms and messages vanish when the last user leaves—no databases, no persistence, **zero traces**. Built with modern web technologies, it offers a **WhatsApp-like experience** in your browser: **private/public rooms**, **message replies with full context**, **emoji picker**, **dark/light themes**, and **mobile-first responsiveness**.

**[Live Demo](https://temp-chat-nqzf.onrender.com/)**

## Features

### Core Functionality
- **Ephemeral Rooms** – Rooms **auto-delete** when empty. No logs, no history.
- **Public & Private Rooms**  
  | Type     | Description                          | Passkey Required? |
  |----------|--------------------------------------|-------------------|
  | **Public** | Anyone with the Room ID can join   | No                |
  | **Private**| Protected by a custom passkey       | Yes               |
- **Unique Usernames** – Case-insensitive duplicate check per room.
- **Real-Time Messaging** – Instant delivery via **Socket.IO**.

### Advanced Messaging
- **Reply to Messages** (WhatsApp-style)  
  - Tap the **reply icon** (Reply Icon) on any message.  
  - **Full context** is embedded – late joiners see the **original username + full text**.  
  - **Smart personalization** – “Replied to **your message**” for self-replies.  
  - **One-tap scroll** – click the preview to jump to the original message.
- **Message Truncation**  
  | Length      | Behaviour                                    |
  |-------------|----------------------------------------------|
  | **≤ 500 chars** | Full display                                 |
  | **> 500 chars** | Show first 500 + **“Show more”** button      |
- **Text Wrapping** – Max **30 characters per line**; no horizontal scroll.
- **Timestamps** – `HH:MM` on every message.
- **“You” Personalisation** – Your messages display **“You”**; others see usernames.

### UI / UX Enhancements
- **Mobile-First Responsive** – Works flawlessly on phones, tablets, desktops.
- **Themes** – **Light**, **Dark**, **System** (auto-detects OS preference).
- **Emoji Picker** – **200+ common emojis** (tap to insert).
- **Copy Utilities**  
  - Room ID  
  - **Full Join URL** (`https://your-app.com/?room=abc123`)
- **Push Notifications** – Browser alerts for new messages (permission-based).
- **Auto-Focus** – Inputs focus instantly for smooth flow.
- **Graceful Quit** – System message “*username* left the chat” + clean disconnect.

### Technical Highlights
- **Single HTML File** – No build step; React (UMD) + Tailwind CDN.
- **PWA-Ready** – Service Worker for offline caching.
- **Structured Socket Events** – No prompt parsing, clean payloads.
- **User-Friendly Errors** – e.g., “Invalid passkey”.

## Screenshots

| **Home Screen** | **Create Room** | **Chat with Replies** |
|-----------------|-----------------|-----------------------|
| ![Home](https://cdn.jsdelivr.net/gh/codes-by-chetan/Images_Server@main/tempchat_home.png) | ![Host](https://cdn.jsdelivr.net/gh/codes-by-chetan/Images_Server@main/tempchat_room_cretated.png) | ![Chat](https://cdn.jsdelivr.net/gh/codes-by-chetan/Images_Server@main/tempchat_chat_demo.png) |

*(Tip: add a short GIF of the reply-scroll feature for extra polish.)*

## Quick Start (Local)

### Prerequisites
- **Node.js** ≥ 18
- **npm** / **yarn**

### Clone & Run
```bash
git clone https://github.com/codes-by-chetan/temp-chat.git
cd tempchat
npm install
npm start          # Server runs on http://localhost:3001
```

Open **[http://localhost:3001](http://localhost:3001)** in your browser.

### One-Command Dev
```bash
npm install && npm start
```

## Usage Guide

1. **Host a Room**  
   - Click **“Host Room”** → choose **Public** or **Private** (optional passkey).  
   - **Copy Room ID** or **Join URL** → share.  
   - Join your own room to set a username.

2. **Join a Room**  
   - **Direct link**: `https://your-app.com/?room=ABC123`  
   - Or **“Join Room”** → paste ID (plus passkey if private).

3. **Chat**  
   - Set a **unique username**.  
   - Type → **Enter** or **Send** button.  
   - **Reply** → tap **Reply Icon** → type → send (auto-cancels).  
   - **Quit** → **Exit** button → room cleans up.

**Pro Tips**  
- **Mobile** – full touch support.  
- **Share** – always use the **Join URL** for one-tap entry.  
- **Privacy** – rooms disappear instantly when empty.

## Deployment (Free / 1-Click)

### Render (recommended)
1. Fork this repo.  
2. Click **[Deploy to Render](https://render.com/)**.  
3. **Build Command**: `npm install`  
4. **Start Command**: `node server.js`  

**Done!**

### Other Platforms
- **Vercel / Netlify** – serve `public/` as static + backend proxy.  
- **Railway / Fly.io** – Docker-ready.  
- **Self-Host** – `npm start` behind NGINX reverse proxy.

## Roadmap (Upcoming Features)

| Priority | Feature                | ETA       | Details                                 |
|----------|------------------------|-----------|-----------------------------------------|
| **High** | **E2E Encryption**     | Next      | AES-256 per-room keys.                  |
| **High** | **File / Image Attachments** | Next | Drag-drop + previews.                   |
| **Medium**| **Voice Messages**     | Q1 2026   | Record & play in-browser.               |
| **Medium**| **Typing Indicators**  | Q1 2026   | “User is typing…”                       |
| **Low**   | **Reactions**          | Q2 2026   | Like/Dislike on messages.               |
| **Low**   | **Room Password Reset**| Q2 2026   | Host-only control.                      |

**Contributions welcome!** → see `CONTRIBUTING.md`

## Tech Stack

```
Frontend : React (UMD) + Tailwind CSS + Socket.IO Client
Backend  : Node.js + Express + Socket.IO + Winston
Other    : UUIDv4 + Service Worker (PWA)
Deployment: Render / Vercel (Serverless)
```

**Bundle size**: **< 50 KB** gzipped!

## Contributing

1. **Fork** → **Clone** → create a **feature branch**.  
2. `npm i` → `npm start` (dev server).  
3. Open a **Pull Request** with a clear description + mobile testing.

**Found a bug?** Open an issue.

## License

[MIT](LICENSE) © **Chetan Mohite / codes-by-chetan**

**Made with Love for temporary chats. Share freely!**

---

**Star if you like it!**
```

---

### How to create the file

1. Open your project folder.  
2. Create a new file named **`README.md`**.  
3. Paste the entire markdown content **exactly** as shown above.  
4. Replace the placeholders:  
   - `YOUR-USERNAME` → your GitHub username  
   - `YOUR-REPO` → your repository name  
   - (Optional) add real screenshot URLs.  
5. Commit & push.

Your repo will now have a **professional, fully functional README** ready for GitHub!