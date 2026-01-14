# 🖥️ VOID_OS Devlog

## Devlog #1: Initial Release - Entering the Void
**Date:** January 12, 2026
**Version:** 1.0.0 (Alpha)

### 👋 Introduction
Welcome to the first devlog for **VOID_OS**! This project started as a submission for the *Flavortown Hack Club* contest. The goal was to create a game that captures the essence of 80s/90s cyber-thrillers—green text on black screens, cryptic commands, and the thrill of unauthorized access—all within a simple terminal window.

### 🛠️ What We Built (So Far)

For this initial V1 release, I focused on the core loop of the "skid" (script kiddie) experience:

1.  **The Atmospheric Engine**: 
    Custom `type_writer` effects and ANSI color codes (`\033[92m` for that classic hacker green) were essential. The game doesn't just print text; it *streams* it to simulate a slow connection or a retro CRT monitor.
    
2.  **Network Scanning**:
    The `scan` command populates a list of targets with varying difficulty. I implemented a simple risk/reward system where harder servers have better protection but offer more loot.

3.  **Brute Force Minigame**:
    Hacking isn't just typing `access granted`. I added a visual "brute force" simulation where the code rapidly guesses characters. It's purely visual for now (success is RNG-weighted), but it sells the fantasy.

4.  **The Economy**:
    Money earned from hacks can be spent in the **Dark Market**. Currently, you can buy "ScriptKiddie Toolsets", but the inventory system is built to support much more complex items in the future.

### 🐛 Challenges & Learning
One of the fun challenges was handling the "game state" without a database. I opted for a JSON-based save system (`void_os_save.json`) which serializes the `GameState` class. It's simple, hackable (ironically), and works perfectly for a local Python game.

### 🔮 What's Next?
The community feedback is vital! Based on initial thoughts, here is the roadmap:
*   **More Minigames**: SQL Injection puzzles and buffer overflow challenges.
*   **Better Story**: A narrative layer where you uncover a corporate conspiracy.
*   **GUI Version**: Maybe experimenting with a retro-styled graphical interface?

Stay tuned. The Void is listening.

---
*Developed by [Your Name/Handle]*

## Devlog #2: Breaking the Firewalls (The Web Port)
**Date:** January 12, 2026
**Version:** 1.1.0 (Web Beta)

### 🌍 Going Global
The biggest barrier to entry for VOID_OS was... well, you needed Python to run it. Today, that changes. I've ported the entire experience to the web, making it accessible to anyone with a browser. No `pip install`, just a link.

### 🔌 The Tech Stack Shift
Moving from Python to standard Web Tech (HTML/CSS/JS) required rethinking the architecture:

1.  **The DOM Terminal**: 
    Instead of `print()`, we're now appending `<div>` elements to a terminal container. This actually gives us MORE control over styling (bold, colors, glowing text) than standard console codes.
    
2.  **CRT Aesthetics**: 
    CSS allows for some beautiful post-processing effects. I added a subtle `scanline` animation and a radial gradient overlay to mimic the curvature and glow of old-school CRT monitors. It feels more "alive" than a standard command prompt.

3.  **Local Storage**:
    The `void_os_save.json` file is gone. In its place, we use the browser's `localStorage`. This means your hacker reputation persists between sessions without you needing to manage save files.

### 🐛 Squashing Bugs
Launch wasn't perfect (is it ever?). We quickly patched a few visual glitches:
*   **The "Premature Prompt"**: The login prompt was appearing before the boot sequence finished. Fixed it by managing visibility states in JS.
*   **ASCII Art**: The logo was getting squashed. Wrapped it in `<pre>` tags to respect the sacred geometry of ASCII.

### 🚀 Try It
The web version is live! You can scan networks, crack passwords, and buy tools right from your browser. 

*Hack the planet.*

