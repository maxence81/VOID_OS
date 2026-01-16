# 🖥️ VOID_OS — Hacker Simulator

<p align="center">
  <img src="https://img.shields.io/badge/version-4.0-00ff00?style=for-the-badge&labelColor=000000" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-00aaff?style=for-the-badge&labelColor=000000" alt="License">
  <img src="https://img.shields.io/badge/platform-Web-ff6600?style=for-the-badge&labelColor=000000" alt="Platform">
</p>

<p align="center">
  <strong>A retro terminal-based hacking simulator inspired by 80s/90s cyber-thrillers.</strong><br>
  <em>No installation required — runs directly in your browser.</em>
</p>

<p align="center">
  <a href="https://maxence81.github.io/VOID_OS/"><img src="https://img.shields.io/badge/▶_PLAY_NOW-00ff00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTggNXYxNGwxMS03eiIvPjwvc3ZnPg==" alt="Play Now"></a>
</p>

---

## 🎮 What is VOID_OS?

**VOID_OS** is an immersive browser-based hacking simulation game. Step into the role of an underground hacker navigating a world of corporate espionage, mysterious contacts, and digital heists — all from a retro CRT terminal interface.

### ⚡ Features

| | Feature | Description |
|---|---------|-------------|
| 🔍 | **Network Scanning** | Discover vulnerable systems and map the network |
| 🔓 | **Password Cracking** | Watch brute-force attacks unfold in real-time |
| 💰 | **Dark Market** | Buy hacking tools and upgrade your arsenal |
| 📧 | **Mail System** | Receive mysterious messages and mission briefings |
| 🎯 | **Missions** | Complete hacking contracts for reputation and credits |
| 🕹️ | **Arcade** | Snake, Hex Dump puzzles, and other mini-games |
| 🖥️ | **CRT Aesthetic** | Authentic scanlines, phosphor glow, and retro vibes |
| 💾 | **Auto-Save** | Your progress persists via LocalStorage |
| 🎵 | **Sound FX** | Immersive keyboard clicks and system sounds |

---

## 🕹️ Commands

```
scan            Discover networks and vulnerable systems
connect <ip>    Connect to a target system  
hack            Attempt to breach connected system
missions        View available hacking contracts
mail            Check your inbox for messages
shop            Browse the Dark Market
status          View your stats (money, rep, inventory)
clear           Clear the terminal screen
help            Display available commands
```

---

## 📸 Screenshots

```
╔══════════════════════════════════════════════════════════════╗
║  ██╗   ██╗ ██████╗ ██╗██████╗        ██████╗ ███████╗        ║
║  ██║   ██║██╔═══██╗██║██╔══██╗      ██╔═══██╗██╔════╝        ║
║  ██║   ██║██║   ██║██║██║  ██║█████╗██║   ██║███████╗        ║
║  ╚██╗ ██╔╝██║   ██║██║██║  ██║╚════╝██║   ██║╚════██║        ║
║   ╚████╔╝ ╚██████╔╝██║██████╔╝      ╚██████╔╝███████║        ║
║    ╚═══╝   ╚═════╝ ╚═╝╚═════╝        ╚═════╝ ╚══════╝        ║
╚══════════════════════════════════════════════════════════════╝

Welcome to VOID_OS 4.0 (Monolith Edition)
KERNEL LOADING ... OK
LOADING STATIC DATASETS ... OK

Enter identity: _
```

---

## 🛠️ Tech Stack

- **HTML5 / CSS3** — Retro terminal UI with CRT post-processing effects
- **Vanilla JavaScript (ES6+)** — Modular architecture with 15+ modules
- **LocalStorage API** — Persistent game state across sessions
- **Web Audio API** — Procedurally generated sound effects

---

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/maxence81/VOID_OS.git

# Navigate to the folder
cd VOID_OS

# Open in browser (or use a local server)
start index.html
# or
npx serve .
```

---

## 📁 Project Structure

```
VOID_OS/
├── index.html          # Entry point
├── style.css           # CRT terminal styling
├── bundle.js           # Production bundle
├── js/                 # Source modules
│   ├── main.js         # Game controller
│   ├── terminal.js     # Terminal I/O & rendering
│   ├── network.js      # Network simulation
│   ├── missions.js     # Mission & contract system
│   ├── mail.js         # Inbox system
│   ├── story.js        # Narrative controller
│   ├── audio.js        # Sound effects (Web Audio)
│   ├── arcade.js       # Mini-games (Snake, etc.)
│   ├── database.js     # Data persistence
│   ├── filesystem.js   # Virtual filesystem
│   ├── kernel.js       # Boot sequence
│   ├── voidscript.js   # Custom scripting language
│   └── ...
├── DEVLOG.md           # Development history
└── LICENSE             # MIT License
```

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Credits

Created for the **Hack Club Arcade** by [@maxence81](https://github.com/maxence81)

---

<p align="center">
  <code>🌌 The Void is listening...</code>
</p>
