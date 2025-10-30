# Contributing to TempChat

Thank you for your interest in contributing to **TempChat**!  
Your help makes this project better for everyone.

We welcome all contributions: **bug fixes**, **features**, **documentation**, **UI improvements**, and **performance optimizations**.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).  
By participating, you agree to uphold this code.

---

## How to Contribute

### 1. **Fork & Clone**
```bash
git clone https://github.com/codes-by-chetan/temp-chat.git
cd tempchat
```

### 2. **Set Up Development Environment**
```bash
npm install
npm start
```
> Server runs at: [http://localhost:3001](http://localhost:3001)

### 3. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. **Make Your Changes**
- Keep code **clean, readable, and well-commented**.
- Follow existing **naming conventions** and **structure**.
- Test on **mobile and desktop**.
- Update `README.md` if needed.

### 5. **Test Thoroughly**
- **Manual testing**: Host/join rooms, send replies, check late-joiner context.
- **Edge cases**: Long messages (>500 chars), duplicate usernames, disconnects.
- **Mobile**: Use Chrome DevTools device mode.

### 6. **Commit with Clear Messages**
```bash
git add .
git commit -m "feat: add message truncation with show more/less"
```

### 7. **Push & Open Pull Request**
```bash
git push origin feature/your-feature-name
```
- Go to GitHub → Open a **Pull Request**.
- Link related **issues**.
- Describe **what** you changed and **why**.

---

## Development Guidelines

| Area         | Guideline |
|--------------|---------|
| **Frontend** | React (UMD), Tailwind CSS, no build tools. Keep it in `public/index.html`. |
| **Backend**  | Node.js + Express + Socket.IO. Keep in `server.js`. |
| **Performance** | Avoid heavy libraries. Keep bundle < 100 KB. |
| **Security** | Never trust client input. Validate on server. |
| **Ephemeral** | **No persistence** — no DB, no file writes. |

---

## Feature Ideas (Pick One!)

- [ ] E2E encryption (AES-256 per room)
- [ ] File/image sharing (drag & drop)
- [ ] Voice messages (record & play)
- [ ] Typing indicators
- [ ] Message reactions
- [ ] Dark mode toggle persistence

---

## Reporting Bugs

1. **Search** existing issues.
2. If none exist, **open a new issue**.
3. Include:
   - **Steps to reproduce**
   - **Expected** vs **Actual** behavior
   - **Screenshots/GIFs**
   - **Browser/OS**

---

## Questions?

Open an **issue** with the label `question` — we'll respond quickly.

---

**Thank you for making TempChat better!**  
Let’s build the best ephemeral chat together.

---
