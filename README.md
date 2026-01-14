# 🖥️ VOID_OS — Hacker Simulator

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0-green?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/platform-Web-orange?style=flat-square" alt="Platform">
</p>

<p align="center">
  <em>A retro terminal-based hacking simulator inspired by 80s/90s cyber-thrillers.</em>
</p>

---

## 🎮 Play Now

**[▶️ Launch VOID_OS](https://maxence81.github.io/VOID_OS/)**

No installation required — runs directly in your browser!

---

## 📖 About

**VOID_OS** is an immersive hacking simulation game that puts you in the shoes of an underground hacker. Experience the thrill of:

- 🔍 **Network Scanning** — Discover vulnerable systems on the network
- 🔓 **Password Cracking** — Watch brute-force attacks unfold in real-time
- 💰 **Dark Market** — Buy hacking tools and upgrade your arsenal
- 📧 **Mail System** — Receive mysterious messages and contracts
- 🎯 **Missions** — Complete hacking contracts for reputation and money
- 🕹️ **Arcade Mini-games** — Play Snake and Hex Dump challenges

All wrapped in an authentic **CRT terminal aesthetic** with scanlines, screen glow, and retro sound effects.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Retro CRT Effects** | Authentic scanlines, screen curvature, and phosphor glow |
| 💾 **Persistent Saves** | Your progress is automatically saved to LocalStorage |
| 🎵 **Immersive Audio** | Keyboard sounds and boot sequences |
| 📜 **Story Mode** | Uncover a corporate conspiracy through missions |
| 🎮 **Mini-games** | Snake, Hex Dump puzzles, and brute-force simulations |

---

## 🕹️ Commands

```
scan          Discover networks and vulnerable systems
connect <ip>  Connect to a target system
missions      View available hacking contracts
mail          Check your inbox for messages
help          Display available commands
```

---

## 🛠️ Tech Stack

- **HTML5 / CSS3** — Retro terminal UI with CRT effects
- **Vanilla JavaScript** — Modular ES6 architecture
- **LocalStorage API** — Persistent game state
- **Web Audio API** — Immersive sound effects

---

## 🚀 Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/maxence81/VOID_OS.git
   ```

2. Open `index.html` in your browser — that's it!

   Or use a local server:
   ```bash
   npx serve .
   ```

---

## 📁 Project Structure

```
VOID_OS/
├── index.html      # Main entry point
├── style.css       # CRT terminal styling
├── bundle.js       # Bundled JavaScript
├── script.js       # Main script
└── js/             # Source modules
    ├── main.js         # Game controller
    ├── terminal.js     # Terminal I/O
    ├── network.js      # Network simulation
    ├── missions.js     # Mission system
    ├── mail.js         # Mail system
    ├── story.js        # Story controller
    ├── audio.js        # Sound effects
    ├── arcade.js       # Mini-games
    └── ...
```

---

## 🗺️ Roadmap

- [ ] SQL Injection mini-game
- [ ] Buffer overflow challenges
- [ ] Expanded story campaign
- [ ] More tools in the Dark Market
- [ ] Multiplayer leaderboards

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Originally created for the **Flavortown Hack Club** contest.

---

<p align="center">
  <strong>🌌 The Void is listening...</strong>
</p>
