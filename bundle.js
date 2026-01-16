/* =========================================
   VOID_OS 5.0 - ENHANCED EDITION
   Multi-hour cyberpunk hacking experience
   ========================================= */

/* =========================================
   UTILITIES
   ========================================= */
const Colors = {
    HEADER: 'header', BLUE: 'blue', CYAN: 'cyan', GREEN: 'green',
    WARNING: 'warn', FAIL: 'fail', DIM: 'dim', BOLD: 'bold'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function generateIP() { return `${randomInt(10, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`; }
function formatCurrency(n) { return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

/* =========================================
   GAME STATE - Central State Manager
   ========================================= */
const GameState = {
    // Player
    username: "GUEST",
    level: 1,
    xp: 0,
    money: 100,
    reputation: 0,

    // Story Progress
    currentAct: 1,
    currentChapter: 1,
    storyFlags: {},
    dialogueHistory: [],

    // Factions
    factions: {
        syndicate: { rep: 0, name: "Shadow Syndicate", color: "fail" },
        rebels: { rep: 0, name: "Digital Liberation Front", color: "cyan" },
        corp: { rep: 0, name: "Omnicron Industries", color: "blue" }
    },
    activeFaction: null,

    // Skills (1-10 scale)
    skills: {
        cracking: 1,    // Password/encryption
        stealth: 1,     // Avoid detection
        exploit: 1,     // Buffer overflow, etc
        social: 1,      // Info gathering
        crypto: 1       // Cryptography
    },

    // Progress tracking
    serversHacked: [],
    missionsCompleted: [],
    achievementsUnlocked: [],
    secretsFound: [],
    totalPlayTime: 0,
    sessionStart: Date.now(),

    // Current session
    connectedServer: null,
    activeMission: null,
    inventory: [],
    unlockedTools: ['basic_scanner'],

    // Save/Load
    save() {
        const data = { ...this };
        delete data.save; delete data.load;
        data.totalPlayTime += (Date.now() - this.sessionStart);
        localStorage.setItem('void_os_v5', JSON.stringify(data));
    },
    load() {
        const saved = localStorage.getItem('void_os_v5');
        if (saved) {
            Object.assign(this, JSON.parse(saved));
            this.sessionStart = Date.now();
            return true;
        }
        return false;
    }
};

/* =========================================
   STORY DATA - Narrative Content
   ========================================= */
const STORY_DATA = {
    acts: {
        1: { name: "The Awakening", chapters: 5 },
        2: { name: "The Conspiracy", chapters: 8 },
        3: { name: "The Network", chapters: 6 },
        4: { name: "The Breach", chapters: 4 },
        5: { name: "Aftermath", chapters: 3 }
    },

    npcs: {
        shadow: {
            name: "The Shad0w",
            ascii: `  ╔══╗
  ║??║
  ╚══╝`,
            faction: "syndicate",
            personality: "mysterious, mentor-like"
        },
        cipher: {
            name: "Cipher",
            ascii: `  [C1PH3R]`,
            faction: "rebels",
            personality: "idealistic, passionate"
        },
        director: {
            name: "Director Kane",
            ascii: `  <OMNICRON>`,
            faction: "corp",
            personality: "cold, calculating"
        },
        ghost: {
            name: "Gh0st",
            ascii: `  ░░░░░░`,
            faction: null,
            personality: "rival hacker, competitive"
        },
        oracle: {
            name: "The Oracle",
            ascii: `  ◉_◉`,
            faction: null,
            personality: "AI, cryptic"
        }
    },

    // Story triggers based on progress
    triggers: [
        { act: 1, chapter: 1, condition: () => GameState.username !== "GUEST", event: "first_contact" },
        { act: 1, chapter: 2, condition: () => GameState.serversHacked.length >= 1, event: "shadow_impressed" },
        { act: 1, chapter: 3, condition: () => GameState.money >= 500, event: "market_access" },
        { act: 1, chapter: 4, condition: () => GameState.serversHacked.length >= 3, event: "faction_choice" },
        { act: 1, chapter: 5, condition: () => GameState.activeFaction !== null, event: "act1_complete" },
        { act: 2, chapter: 1, condition: () => GameState.currentAct === 2, event: "conspiracy_begins" },
        { act: 2, chapter: 3, condition: () => GameState.level >= 3, event: "deep_web_access" },
        { act: 2, chapter: 5, condition: () => GameState.secretsFound.length >= 3, event: "truth_revealed" }
    ]
};

/* =========================================
   DIALOGUE SYSTEM
   ========================================= */
const DIALOGUES = {
    first_contact: [
        { speaker: "shadow", text: "So... you finally found the backdoor." },
        { speaker: "shadow", text: "I've been watching you. Your skills are... raw. But promising." },
        { speaker: "shadow", text: "There's a war coming. Not with guns - with code." },
        { speaker: "shadow", text: "Complete some contracts. Prove you're worth my time." },
        { speaker: "system", text: "[NEW: Use 'missions' to view contracts]" }
    ],

    shadow_impressed: [
        { speaker: "shadow", text: "Not bad. You got through their firewall." },
        { speaker: "shadow", text: "But that was just a warm-up. The real targets are deeper." },
        { speaker: "shadow", text: "Keep your head down. Omnicron has eyes everywhere." }
    ],

    faction_choice: [
        { speaker: "system", text: "=== CRITICAL DECISION ===" },
        { speaker: "shadow", text: "You've proven yourself. Now it's time to choose." },
        { speaker: "cipher", text: "Join us! The Digital Liberation Front fights for freedom!" },
        { speaker: "director", text: "Or... work with Omnicron. We pay well. Very well." },
        { speaker: "shadow", text: "The Syndicate offers power. True power in the shadows." },
        { speaker: "system", text: "[Use 'faction join <syndicate|rebels|corp>' to choose]" }
    ],

    conspiracy_begins: [
        { speaker: "shadow", text: "You made your choice. Now the real work begins." },
        { speaker: "shadow", text: "Omnicron isn't just a corporation. They're building something." },
        { speaker: "shadow", text: "Project PANOPTICON. Total surveillance. Total control." },
        { speaker: "shadow", text: "We need proof. Hack their subsidiaries. Find the truth." }
    ],

    truth_revealed: [
        { speaker: "oracle", text: "...SIGNAL DETECTED..." },
        { speaker: "oracle", text: "You have been searching. I have been watching." },
        { speaker: "oracle", text: "The truth you seek is not what you expect." },
        { speaker: "oracle", text: "PANOPTICON is already active. You are already inside it." },
        { speaker: "oracle", text: "Find me. Grid coordinates embedded in your next mail." }
    ]
};

/* =========================================
   SYNTHWAVE MUSIC GENERATOR
   ========================================= */
class SynthwaveGenerator {
    constructor(audioCtx) {
        this.ctx = audioCtx;
        this.isPlaying = false;
        this.masterGain = null;
        this.oscillators = [];
        this.bpm = 110;
        this.currentBeat = 0;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.15;
        this.masterGain.connect(this.ctx.destination);
        this.playLoop();
    }

    stop() {
        this.isPlaying = false;
        this.oscillators.forEach(o => { try { o.stop(); } catch (e) { } });
        this.oscillators = [];
    }

    setIntensity(level) {
        // 0 = ambient, 1 = normal, 2 = tense
        if (this.masterGain) {
            this.masterGain.gain.value = 0.1 + (level * 0.08);
        }
        this.bpm = 100 + (level * 20);
    }

    playLoop() {
        if (!this.isPlaying) return;

        const beatDuration = 60 / this.bpm;

        // Bass line (root notes)
        const bassNotes = [55, 55, 73.4, 55, 82.4, 55, 73.4, 55]; // A1, D2, E2
        const bassNote = bassNotes[this.currentBeat % bassNotes.length];
        this.playNote(bassNote, 'sawtooth', beatDuration * 0.8, 0.12);

        // Arpeggio (every other beat)
        if (this.currentBeat % 2 === 0) {
            const arpNotes = [220, 277, 330, 440, 330, 277];
            const arpNote = arpNotes[Math.floor(this.currentBeat / 2) % arpNotes.length];
            this.playNote(arpNote, 'square', beatDuration * 0.3, 0.05);
        }

        // Pad (every 4 beats)
        if (this.currentBeat % 4 === 0) {
            this.playPad([110, 165, 220], beatDuration * 3);
        }

        // Hi-hat (every beat)
        this.playNoise(0.02, 0.03);

        // Kick (every 4 beats)
        if (this.currentBeat % 4 === 0) {
            this.playKick();
        }

        this.currentBeat++;
        setTimeout(() => this.playLoop(), beatDuration * 1000);
    }

    playNote(freq, type, duration, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
        this.oscillators.push(osc);
    }

    playPad(freqs, duration) {
        freqs.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.5);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        });
    }

    playNoise(duration, volume) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.value = 8000;

        noise.buffer = buffer;
        gain.gain.value = volume;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start();
    }

    playKick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

/* =========================================
   ENHANCED AUDIO SYSTEM
   ========================================= */
class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
        this.music = new SynthwaveGenerator(this.ctx);
        this.musicEnabled = true;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) this.music.start();
        else this.music.stop();
        return this.musicEnabled;
    }

    playTone(freq, type, duration, vol = 0.1) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playKeySound() {
        this.playTone(800 + Math.random() * 200, 'square', 0.03, 0.03);
    }

    playBoot() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 1);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
        osc.stop(this.ctx.currentTime + 1.5);
    }

    playAccessGranted() {
        this.playTone(1200, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(1800, 'sine', 0.2, 0.1), 100);
    }

    playAccessDenied() {
        this.playTone(150, 'sawtooth', 0.2, 0.2);
        setTimeout(() => this.playTone(100, 'sawtooth', 0.4, 0.2), 200);
    }

    playLevelUp() {
        [0, 100, 200, 300, 400].forEach((delay, i) => {
            setTimeout(() => this.playTone(440 * (1 + i * 0.2), 'sine', 0.15, 0.12), delay);
        });
    }

    playAlert() {
        this.playTone(800, 'square', 0.1);
        setTimeout(() => this.playTone(600, 'square', 0.1), 150);
        setTimeout(() => this.playTone(800, 'square', 0.1), 300);
    }

    playHack() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.playTone(200 + Math.random() * 1000, 'sawtooth', 0.05, 0.05);
            }, i * 50);
        }
    }

    playSuccess() {
        this.playTone(523, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(659, 'sine', 0.1, 0.1), 100);
        setTimeout(() => this.playTone(784, 'sine', 0.2, 0.15), 200);
    }

    playError() {
        this.playTone(200, 'square', 0.3, 0.15);
    }

    playDataTransfer() {
        const interval = setInterval(() => {
            this.playTone(1000 + Math.random() * 500, 'sine', 0.02, 0.02);
        }, 30);
        setTimeout(() => clearInterval(interval), 500);
    }
}

/* =========================================
   MAIL SYSTEM - Story Delivery
   ========================================= */
class Mail {
    constructor(sender, subject, body, encrypted = false, attachment = null) {
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.read = false;
        this.encrypted = encrypted;
        this.attachment = attachment;
        this.timestamp = new Date().toLocaleTimeString();
    }
}

class MailSystem {
    constructor() { this.inbox = []; }

    addMail(sender, subject, body, encrypted = false, attachment = null) {
        const mail = new Mail(sender, subject, body, encrypted, attachment);
        this.inbox.unshift(mail);
        return mail;
    }

    getUnreadCount() { return this.inbox.filter(m => !m.read).length; }

    listMail() {
        return this.inbox.map((m, i) => {
            const status = m.read ? " " : "*";
            const enc = m.encrypted ? "🔒" : "  ";
            return `${i} [${status}]${enc} ${m.sender.padEnd(15)} | ${m.subject}`;
        });
    }

    readMail(index) {
        const mail = this.inbox[index];
        if (!mail) return null;
        if (mail.encrypted && GameState.skills.crypto < 2) {
            return "[ENCRYPTED - Crypto skill too low to decrypt]";
        }
        mail.read = true;
        let content = `
FROM: ${mail.sender}
TIME: ${mail.timestamp}
SUBJ: ${mail.subject}
${"─".repeat(50)}
${mail.body}
${"─".repeat(50)}`;
        if (mail.attachment) content += `\n[ATTACHMENT: ${mail.attachment}]`;
        return content;
    }
}

/* =========================================
   MINIGAMES SYSTEM
   ========================================= */
class MinigameManager {
    constructor(terminal, audio) {
        this.term = terminal;
        this.audio = audio;
        this.activeGame = null;
    }

    // BRUTE FORCE - Simplified timing game
    async startBruteForce(difficulty, onComplete) {
        this.term.clear();
        this.term.print("═══ BRUTE FORCE ATTACK ═══", Colors.HEADER);
        this.term.print("Press SPACEBAR when the bar reaches the green zone!", Colors.DIM);
        this.term.print("", "");

        const rounds = Math.min(3, 1 + Math.floor(difficulty / 3)); // 1-3 rounds based on difficulty
        let successCount = 0;
        let currentRound = 0;

        const runRound = () => {
            return new Promise((resolve) => {
                let position = 0;
                const width = 30;
                const targetStart = 10 + randomInt(0, 10); // Green zone start
                const targetEnd = targetStart + (8 - difficulty); // Larger zone for lower difficulty
                let completed = false;

                const updateBar = () => {
                    let bar = "[";
                    for (let i = 0; i < width; i++) {
                        if (i >= targetStart && i <= targetEnd) {
                            bar += i === position ? "█" : "▓";
                        } else {
                            bar += i === position ? "█" : "░";
                        }
                    }
                    bar += `] Round ${currentRound + 1}/${rounds}`;
                    this.term.setScreenContent(`PASSWORD CRACK\n\n${bar}\n\nPress SPACE in the green zone!`);
                };

                const interval = setInterval(() => {
                    position++;
                    if (position >= width) position = 0;
                    updateBar();
                }, 80 + (3 - difficulty) * 20); // Slower for lower difficulty

                const handler = (e) => {
                    if (completed) return;
                    if (e.code === 'Space' || e.key === ' ') {
                        e.preventDefault();
                        completed = true;
                        clearInterval(interval);
                        document.removeEventListener('keydown', handler);

                        const success = position >= targetStart && position <= targetEnd;
                        if (success) {
                            this.audio.playTone(1000, 'sine', 0.1);
                            successCount++;
                        } else {
                            this.audio.playError();
                        }
                        resolve(success);
                    }
                };

                document.addEventListener('keydown', handler);
                updateBar();
            });
        };

        // Run all rounds
        for (let i = 0; i < rounds; i++) {
            currentRound = i;
            await runRound();
            await sleep(500);
        }

        const success = successCount >= Math.ceil(rounds / 2); // Need half the rounds
        this.term.clear();

        if (success) {
            this.term.print("[ACCESS GRANTED]", Colors.GREEN);
            this.audio.playAccessGranted();
            GameState.skills.cracking = Math.min(10, GameState.skills.cracking + 0.1);
        } else {
            this.term.print(`[ACCESS DENIED] ${successCount}/${rounds} rounds`, Colors.FAIL);
            this.audio.playAccessDenied();
        }

        await sleep(1000);
        return success;
    }

    // SQL INJECTION PUZZLE
    async startSQLi(difficulty, onComplete) {
        this.term.clear();
        this.term.print("═══ SQL INJECTION CHALLENGE ═══", Colors.HEADER);
        this.term.print("");

        const challenges = [
            {
                query: "SELECT * FROM users WHERE username='[INPUT]' AND password='pass'",
                solutions: ["' OR '1'='1", "admin'--", "' OR 1=1--"], hint: "Classic bypass"
            },
            {
                query: "SELECT * FROM users WHERE id=[INPUT]",
                solutions: ["1 OR 1=1", "1; DROP TABLE users--", "1 UNION SELECT * FROM admins"], hint: "No quotes needed"
            },
            {
                query: "SELECT * FROM products WHERE name LIKE '%[INPUT]%'",
                solutions: ["'; DROP TABLE products--", "' UNION SELECT password FROM users--"], hint: "LIKE injection"
            }
        ];

        const challenge = challenges[Math.min(difficulty - 1, challenges.length - 1)];

        this.term.print("TARGET QUERY:", Colors.CYAN);
        this.term.print(challenge.query);
        this.term.print("");
        this.term.print(`DIFFICULTY: ${difficulty} | HINT: ${challenge.hint}`, Colors.DIM);
        this.term.print("");
        this.term.print("Enter your injection payload:", Colors.GREEN);

        return new Promise((resolve) => {
            this.term.requestInput((input) => {
                const success = challenge.solutions.some(s =>
                    input.toLowerCase().includes(s.toLowerCase().substring(0, 5)));

                if (success) {
                    this.term.print("[INJECTION SUCCESSFUL] Database compromised!", Colors.GREEN);
                    this.audio.playSuccess();
                    GameState.skills.exploit = Math.min(10, GameState.skills.exploit + 0.2);
                    resolve(true);
                } else {
                    this.term.print("[INJECTION FAILED] Query sanitized.", Colors.FAIL);
                    this.audio.playError();
                    resolve(false);
                }
            });
        });
    }

    // CRYPTOGRAPHY DECRYPTION
    async startCrypto(difficulty) {
        this.term.clear();
        this.term.print("═══ CRYPTOGRAPHY CHALLENGE ═══", Colors.HEADER);

        const messages = [
            { plain: "THE PASSWORD IS SHADOW", cipher: "caesar", shift: 3 },
            { plain: "ACCESS CODE SEVEN FOUR TWO", cipher: "caesar", shift: 7 },
            { plain: "INITIATE PROTOCOL OMEGA", cipher: "caesar", shift: 13 }
        ];

        const msg = messages[Math.min(difficulty - 1, messages.length - 1)];
        const encrypted = msg.plain.split('').map(c => {
            if (c === ' ') return ' ';
            return String.fromCharCode(((c.charCodeAt(0) - 65 + msg.shift) % 26) + 65);
        }).join('');

        this.term.print(`CIPHER: ${msg.cipher.toUpperCase()} (shift unknown)`, Colors.CYAN);
        this.term.print(`ENCRYPTED: ${encrypted}`, Colors.WARNING);
        this.term.print("");
        this.term.print("Decrypt the message:", Colors.GREEN);

        return new Promise((resolve) => {
            this.term.requestInput((input) => {
                if (input.toUpperCase().includes(msg.plain.substring(0, 10))) {
                    this.term.print("[DECRYPTED] Message decoded!", Colors.GREEN);
                    this.audio.playSuccess();
                    GameState.skills.crypto = Math.min(10, GameState.skills.crypto + 0.3);
                    resolve(true);
                } else {
                    this.term.print("[FAILED] Incorrect decryption.", Colors.FAIL);
                    this.audio.playError();
                    resolve(false);
                }
            });
        });
    }

    // FIREWALL MAZE - ASCII stealth game  
    async startFirewallMaze(difficulty) {
        this.term.enableGameMode((key) => this.handleMazeInput(key));

        this.mazeWidth = 30;
        this.mazeHeight = 15;
        this.player = { x: 1, y: 1 };
        this.exit = { x: this.mazeWidth - 2, y: this.mazeHeight - 2 };
        this.guards = [];
        this.dataNodes = [];
        this.collected = 0;
        this.detected = false;

        // Generate guards
        for (let i = 0; i < 2 + difficulty; i++) {
            this.guards.push({
                x: randomInt(5, this.mazeWidth - 5),
                y: randomInt(3, this.mazeHeight - 3),
                dir: randomChoice(['h', 'v']),
                range: 3
            });
        }

        // Generate data nodes
        for (let i = 0; i < 3; i++) {
            this.dataNodes.push({
                x: randomInt(3, this.mazeWidth - 3),
                y: randomInt(2, this.mazeHeight - 2),
                collected: false
            });
        }

        this.renderMaze();
        this.mazeInterval = setInterval(() => this.updateMaze(), 500);

        return new Promise((resolve) => {
            this.mazeResolve = resolve;
        });
    }

    handleMazeInput(key) {
        if (this.detected) return;

        const moves = {
            'ArrowUp': { x: 0, y: -1 }, 'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 }, 'ArrowRight': { x: 1, y: 0 },
            'w': { x: 0, y: -1 }, 's': { x: 0, y: 1 },
            'a': { x: -1, y: 0 }, 'd': { x: 1, y: 0 }
        };

        if (key === 'q' || key === 'Escape') {
            this.endMaze(false);
            return;
        }

        const move = moves[key];
        if (move) {
            const newX = this.player.x + move.x;
            const newY = this.player.y + move.y;
            if (newX > 0 && newX < this.mazeWidth - 1 && newY > 0 && newY < this.mazeHeight - 1) {
                this.player.x = newX;
                this.player.y = newY;
                this.audio.playTone(300, 'sine', 0.02, 0.02);
            }
        }

        // Check data collection
        this.dataNodes.forEach(node => {
            if (!node.collected && node.x === this.player.x && node.y === this.player.y) {
                node.collected = true;
                this.collected++;
                this.audio.playSuccess();
            }
        });

        // Check exit
        if (this.player.x === this.exit.x && this.player.y === this.exit.y) {
            this.endMaze(true);
        }

        this.renderMaze();
    }

    updateMaze() {
        // Move guards
        this.guards.forEach(g => {
            if (g.dir === 'h') g.x += (Math.random() > 0.5 ? 1 : -1);
            else g.y += (Math.random() > 0.5 ? 1 : -1);
            g.x = Math.max(2, Math.min(this.mazeWidth - 3, g.x));
            g.y = Math.max(2, Math.min(this.mazeHeight - 3, g.y));

            // Detection check
            const dist = Math.abs(g.x - this.player.x) + Math.abs(g.y - this.player.y);
            if (dist <= g.range - GameState.skills.stealth * 0.3) {
                this.detected = true;
                this.endMaze(false);
            }
        });

        if (!this.detected) this.renderMaze();
    }

    renderMaze() {
        let out = `FIREWALL BREACH | Data: ${this.collected}/3 | 'q' to abort\n`;
        out += "═".repeat(this.mazeWidth) + "\n";

        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                if (x === 0 || x === this.mazeWidth - 1) out += "║";
                else if (this.player.x === x && this.player.y === y) out += "@";
                else if (this.exit.x === x && this.exit.y === y) out += "█";
                else if (this.guards.some(g => g.x === x && g.y === y)) out += "◆";
                else if (this.dataNodes.some(n => !n.collected && n.x === x && n.y === y)) out += "$";
                else out += " ";
            }
            out += "\n";
        }
        out += "═".repeat(this.mazeWidth);
        this.term.setScreenContent(out);
    }

    endMaze(success) {
        clearInterval(this.mazeInterval);
        this.term.disableGameMode();

        if (success) {
            this.term.print(`[BREACH COMPLETE] Data collected: ${this.collected}/3`, Colors.GREEN);
            GameState.skills.stealth = Math.min(10, GameState.skills.stealth + 0.2);
            this.audio.playSuccess();
        } else {
            this.term.print("[DETECTED] Firewall triggered!", Colors.FAIL);
            this.audio.playAccessDenied();
        }

        if (this.mazeResolve) this.mazeResolve(success);
    }
}

/* =========================================
   TERMINAL - Enhanced with history
   ========================================= */
class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.inputLine = document.querySelector('.input-line');
        this.inputField = document.getElementById('command-input');
        this.promptUser = document.getElementById('prompt-user');
        this.terminalDiv = document.getElementById('terminal');
        this.inputCallback = null;
        this.onType = null;
        this.gameMode = false;
        this.gameKeyHandler = null;
        this.commandHistory = [];
        this.historyIndex = -1;

        this.setupListeners();
    }

    setupListeners() {
        this.inputField.addEventListener('keydown', (e) => {
            if (this.gameMode) return;

            // History navigation
            if (e.key === 'ArrowUp' && this.commandHistory.length > 0) {
                e.preventDefault();
                this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
                this.inputField.value = this.commandHistory[this.historyIndex] || '';
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.historyIndex = Math.max(this.historyIndex - 1, -1);
                this.inputField.value = this.historyIndex >= 0 ? this.commandHistory[this.historyIndex] : '';
            }

            if (e.key === 'Enter') {
                const val = this.inputField.value;
                if (val.trim()) {
                    this.commandHistory.unshift(val);
                    if (this.commandHistory.length > 50) this.commandHistory.pop();
                }
                this.historyIndex = -1;
                this.print(`${this.promptUser.textContent}@void:~$ ${val}`, Colors.DIM);
                this.inputField.value = '';

                if (this.inputCallback) {
                    const cb = this.inputCallback;
                    this.inputCallback = null;
                    cb(val);
                } else {
                    document.dispatchEvent(new CustomEvent('terminal-command', { detail: val }));
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.gameMode && this.gameKeyHandler) {
                e.preventDefault();
                this.gameKeyHandler(e.key);
            }
        });
    }

    enableGameMode(onKey) {
        this.gameMode = true;
        this.gameKeyHandler = onKey;
        this.inputLine.style.display = 'none';
        this.clear();
    }

    disableGameMode() {
        this.gameMode = false;
        this.gameKeyHandler = null;
        this.inputLine.style.display = 'flex';
        this.inputField.focus();
        this.clear();
    }

    setScreenContent(text) {
        this.output.innerHTML = `<pre style="line-height:1.2;font-family:'Courier New',monospace;">${text}</pre>`;
    }

    clear() { this.output.innerHTML = ''; }

    print(text, className = '') {
        if (!text) return;
        const p = document.createElement('div');
        if (className) p.classList.add(className);
        if (text.includes('█') || text.includes('>>') || text.includes('\n') || text.includes('═')) {
            p.innerHTML = `<pre>${text}</pre>`;
        } else {
            p.textContent = text;
        }
        this.output.appendChild(p);
        this.scrollToBottom();
    }

    printLogo() {
        const LOGO = `
    ██╗   ██╗ ██████╗ ██╗██████╗         ██████╗ ███████╗
    ██║   ██║██╔═══██╗██║██╔══██╗       ██╔═══██╗██╔════╝
    ██║   ██║██║   ██║██║██║  ██║       ██║   ██║███████╗
    ╚██╗ ██╔╝██║   ██║██║██║  ██║       ██║   ██║╚════██║
     ╚████╔╝ ╚██████╔╝██║██████╔╝       ╚██████╔╝███████║
      ╚═══╝   ╚═════╝ ╚═╝╚═════╝         ╚═════╝ ╚══════╝
        `;
        this.print(LOGO, Colors.CYAN);
    }

    async type(text, speed = 30, className = '') {
        const p = document.createElement('div');
        if (className) p.classList.add(className);
        this.output.appendChild(p);
        for (let char of text) {
            p.textContent += char;
            if (this.onType) this.onType();
            this.scrollToBottom();
            await sleep(speed);
        }
    }

    scrollToBottom() { this.terminalDiv.scrollTop = this.terminalDiv.scrollHeight; }
    setInputVisible(v) { this.inputLine.style.display = v ? 'flex' : 'none'; if (v) this.inputField.focus(); }
    setPrompt(user) { this.promptUser.textContent = user; }
    requestInput(cb) { this.setInputVisible(true); this.inputCallback = cb; }
}

/* =========================================
   FILESYSTEM
   ========================================= */
class File {
    constructor(name, content = "", type = "text", secret = false) {
        this.name = name;
        this.content = content;
        this.type = type;
        this.secret = secret;
    }
}

class Directory {
    constructor(name) {
        this.name = name;
        this.files = {};
        this.subdirs = {};
    }
    addFile(f) { this.files[f.name] = f; }
    addDir(d) { this.subdirs[d.name] = d; }
}

class FileSystem {
    static generateForServer(type, difficulty) {
        const fs = { root: new Directory("root") };

        // Common directories
        const home = new Directory("home");
        const var_ = new Directory("var");
        const log = new Directory("log");
        const etc = new Directory("etc");

        // Add lore based on server type
        if (type === "corp") {
            home.addFile(new File("memo.txt", "REMINDER: Change default passwords before Q4 audit."));
            home.addFile(new File("employees.csv", "id,name,role,salary\n1001,J.Smith,CEO,850000\n1002,M.Davis,CFO,650000"));
            etc.addFile(new File("secrets.enc", "[ENCRYPTED DATA - Requires crypto skill 3]", "encrypted", true));
        } else if (type === "gov") {
            home.addFile(new File("classified.txt", "PROJECT PANOPTICON - PHASE 2\nStatus: Active\nCoverage: 94.7% of population"));
            log.addFile(new File("access.log", "Suspicious access from unknown terminal detected..."));
        }

        log.addFile(new File("syslog", `Boot: ${new Date().toISOString()}\nServices: SSH, HTTP active`));
        var_.addDir(log);
        fs.root.addDir(home);
        fs.root.addDir(var_);
        fs.root.addDir(etc);

        return fs;
    }
}

/* =========================================
   NETWORK - Expanded Server List
   ========================================= */
class Server {
    constructor(ip, hostname, difficulty, type = "corp", tier = 1) {
        this.ip = ip;
        this.hostname = hostname;
        this.difficulty = difficulty;
        this.type = type;
        this.tier = tier;
        this.hacked = false;
        this.ports = this.generatePorts();
        this.fs = FileSystem.generateForServer(type, difficulty);
        this.loot = { money: difficulty * 100 + randomInt(50, 200), data: [], xp: difficulty * 25 };
    }

    generatePorts() {
        const ports = [{ port: 22, service: 'SSH', open: true }];
        if (this.difficulty > 2) ports.push({ port: 80, service: 'HTTP', open: true });
        if (this.difficulty > 4) ports.push({ port: 21, service: 'FTP', open: true });
        if (this.difficulty > 6) ports.push({ port: 3306, service: 'MySQL', open: false });
        if (this.difficulty > 8) ports.push({ port: 443, service: 'HTTPS', open: true });
        return ports;
    }
}

class Network {
    constructor() {
        this.servers = [];
        this.generateWorld();
    }

    generateWorld() {
        // TIER 1 - Easy targets (Act 1)
        const tier1Corps = ["TechStart", "LocalBank", "CityHall", "NewsMedia", "RetailCorp"];
        tier1Corps.forEach((name, i) => {
            this.servers.push(new Server(generateIP(), `${name}_Server`, randomInt(1, 2), "corp", 1));
        });

        // TIER 2 - Medium targets (Act 2)
        const tier2Corps = ["Omnicron_Sub1", "Omnicron_Sub2", "GovArchive", "PoliceDB", "Hospital_Net"];
        tier2Corps.forEach((name, i) => {
            this.servers.push(new Server(generateIP(), name, randomInt(3, 5), "corp", 2));
        });

        // TIER 3 - Hard targets (Act 3)
        const tier3Corps = ["Omnicron_Main", "NSA_Node", "Pentagon_Backup", "CIA_Proxy"];
        tier3Corps.forEach((name, i) => {
            this.servers.push(new Server(generateIP(), name, randomInt(6, 8), "gov", 3));
        });

        // TIER 4 - Endgame (Act 4)
        this.servers.push(new Server("10.0.0.1", "Omnicron_Core", 9, "corp", 4));
        this.servers.push(new Server("10.0.0.2", "PANOPTICON_Hub", 10, "gov", 4));

        // Special/Hidden
        this.servers.push(new Server("127.0.0.1", "localhost", 0, "local", 0));
        this.servers.push(new Server("8.8.8.8", "Google_DNS_Honeypot", 99, "trap", 0));
    }

    findServer(ip) { return this.servers.find(s => s.ip === ip); }

    getServersByTier(tier) { return this.servers.filter(s => s.tier === tier); }
}

/* =========================================
   SHOP - Hardware & Exploits
   ========================================= */
class Shop {
    constructor() {
        this.items = [
            { id: 'ram', name: 'RAM Upgrade (8GB)', cost: 500, desc: 'Faster brute force', effect: () => GameState.skills.cracking += 0.5 },
            { id: 'cpu', name: 'CPU Overclock', cost: 1200, desc: '+1 Exploit skill', effect: () => GameState.skills.exploit += 1 },
            { id: 'vpn', name: 'VPN Premium', cost: 800, desc: '+1 Stealth skill', effect: () => GameState.skills.stealth += 1 },
            { id: 'crypto', name: 'Decryption Toolkit', cost: 1500, desc: '+2 Crypto skill', effect: () => GameState.skills.crypto += 2 },
            { id: 'rootkit', name: 'RootKit Alpha', cost: 3000, desc: 'Access Tier 3 servers', effect: () => GameState.unlockedTools.push('rootkit') },
            { id: 'zero', name: 'Zero-Day Exploit', cost: 8000, desc: 'Access Tier 4 servers', effect: () => GameState.unlockedTools.push('zeroday') },
            { id: 'botnet', name: 'Botnet Access', cost: 5000, desc: 'Passive income $50/min', effect: () => GameState.unlockedTools.push('botnet') }
        ];
    }

    list(term) {
        term.print("═══ DARK WEB MARKETPLACE ═══", Colors.HEADER);
        term.print("ID       | ITEM                  | COST   | DESCRIPTION");
        term.print("─".repeat(65));
        this.items.forEach(item => {
            const owned = GameState.inventory.includes(item.id) ? "[OWNED]" : "";
            term.print(`${item.id.padEnd(8)} | ${item.name.padEnd(21)} | $${item.cost.toString().padEnd(5)} | ${item.desc} ${owned}`);
        });
        term.print("\nUsage: buy <id>");
    }

    buy(id, term, audio) {
        const item = this.items.find(i => i.id === id);
        if (!item) { term.print("Item not found.", Colors.FAIL); return; }
        if (GameState.money < item.cost) { term.print(`Need $${item.cost}. You have $${GameState.money}.`, Colors.FAIL); return; }
        if (GameState.inventory.includes(item.id)) { term.print("Already owned.", Colors.WARNING); return; }

        GameState.money -= item.cost;
        GameState.inventory.push(item.id);
        item.effect();
        term.print(`[+] Purchased: ${item.name}`, Colors.GREEN);
        audio.playSuccess();
    }
}

/* =========================================
   MISSIONS - Story-integrated
   ========================================= */
class Mission {
    constructor(id, title, desc, reward, targetIP, type, difficulty, storyRequired = false) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.reward = reward;
        this.targetIP = targetIP;
        this.type = type;
        this.difficulty = difficulty;
        this.storyRequired = storyRequired;
        this.completed = false;
    }
}

class MissionSystem {
    constructor(network) {
        this.network = network;
        this.allMissions = [];
        this.generateMissions();
    }

    generateMissions() {
        let id = 1;
        const actions = ["Infiltrate", "Extract data from", "Backdoor", "Investigate", "Destroy records in"];

        this.network.servers.forEach(server => {
            if (server.tier === 0) return; // Skip special servers

            const count = server.tier === 4 ? 1 : randomInt(1, 3);
            for (let i = 0; i < count; i++) {
                const action = randomChoice(actions);
                const reward = server.difficulty * 200 + randomInt(100, 500);
                const storyReq = server.tier >= 3;

                this.allMissions.push(new Mission(
                    id++,
                    `${action} ${server.hostname}`,
                    `Target: ${server.ip} | Difficulty: ${server.difficulty}`,
                    reward,
                    server.ip,
                    randomChoice(['hack', 'steal', 'destroy']),
                    server.difficulty,
                    storyReq
                ));
            }
        });
    }

    getAvailable(playerLevel, currentAct) {
        return this.allMissions.filter(m =>
            !m.completed &&
            m.difficulty <= playerLevel + 2 &&
            (!m.storyRequired || currentAct >= 3)
        ).slice(0, 5);
    }

    complete(id) {
        const m = this.allMissions.find(m => m.id === id);
        if (m) m.completed = true;
    }
}

/* =========================================
   STORY CONTROLLER
   ========================================= */
class StoryController {
    constructor(mail, term, audio) {
        this.mail = mail;
        this.term = term;
        this.audio = audio;
        this.dialogueQueue = [];
        this.isPlayingDialogue = false;
    }

    checkTriggers() {
        STORY_DATA.triggers.forEach(trigger => {
            if (GameState.currentAct === trigger.act &&
                GameState.currentChapter === trigger.chapter &&
                !GameState.storyFlags[trigger.event] &&
                trigger.condition()) {

                this.triggerEvent(trigger.event);
                GameState.storyFlags[trigger.event] = true;
                GameState.currentChapter++;

                // Check for act completion
                if (GameState.currentChapter > STORY_DATA.acts[GameState.currentAct].chapters) {
                    this.advanceAct();
                }
            }
        });
    }

    advanceAct() {
        GameState.currentAct++;
        GameState.currentChapter = 1;
        this.term.print(`\n═══ ACT ${GameState.currentAct}: ${STORY_DATA.acts[GameState.currentAct]?.name || "FINALE"} ═══`, Colors.HEADER);
        this.audio.playLevelUp();
    }

    async triggerEvent(eventName) {
        const dialogue = DIALOGUES[eventName];
        if (!dialogue) return;

        this.audio.playAlert();
        await sleep(500);

        for (const line of dialogue) {
            const npc = STORY_DATA.npcs[line.speaker];
            const prefix = npc ? `[${npc.name}]` : "[SYSTEM]";
            const color = line.speaker === "system" ? Colors.WARNING :
                (npc?.faction ? GameState.factions[npc.faction]?.color : Colors.CYAN);

            await this.term.type(`${prefix} ${line.text}`, 25, color);
            await sleep(800);
        }

        GameState.dialogueHistory.push(eventName);
    }

    sendStoryMail(event) {
        const mails = {
            first_contact: { from: "The Shad0w", subj: "Welcome", body: "You found the door. Now prove you can walk through it.\n\nComplete contracts. Build your reputation.\n\n- S" },
            act1_complete: { from: "Unknown", subj: "You've been noticed", body: "Your activities have not gone unnoticed.\n\nOmnicron Industries has flagged your terminal.\n\nBe careful. Or don't. Either way, we'll be watching.\n\n- ???" },
            conspiracy_begins: { from: "Cipher", subj: "URGENT: Meet", body: "Hacker,\n\nWe need to talk. What you've uncovered is just the surface.\n\nProject PANOPTICON is real. And it's already watching.\n\nJoin us. Fight back.\n\n- Cipher, Digital Liberation Front" }
        };

        const m = mails[event];
        if (m) {
            this.mail.addMail(m.from, m.subj, m.body);
            this.term.print(`\n[!] NEW MESSAGE from ${m.from}`, Colors.WARNING);
        }
    }
}

/* =========================================
   MAIN GAME CLASS
   ========================================= */
class Game {
    constructor() {
        this.term = new Terminal();
        this.audio = new AudioSystem();
        this.mail = new MailSystem();
        this.network = new Network();
        this.missions = new MissionSystem(this.network);
        this.shop = new Shop();
        this.story = new StoryController(this.mail, this.term, this.audio);
        this.minigames = new MinigameManager(this.term, this.audio);

        this.term.onType = () => this.audio.playKeySound();
        this.init();
    }

    async init() {
        document.addEventListener('terminal-command', (e) => this.handleCommand(e.detail));

        // Enable audio on first click
        document.body.addEventListener('click', () => {
            if (this.audio.ctx.state === 'suspended') {
                this.audio.ctx.resume();
                this.audio.music.start();
            }
        }, { once: true });

        this.term.setInputVisible(false);
        await this.bootSequence();
    }

    async bootSequence() {
        this.audio.playBoot();
        this.term.printLogo();

        await this.term.type("VOID_OS 5.0 // ENHANCED EDITION", 30, Colors.HEADER);
        await this.term.type("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", 5, Colors.DIM);
        await sleep(300);

        // Loading sequence
        const loadSteps = [
            "Initializing kernel...",
            "Loading network drivers...",
            "Connecting to the grid...",
            "Bypassing corporate firewalls...",
            "Establishing secure channel..."
        ];

        for (const step of loadSteps) {
            await this.term.type(`[*] ${step}`, 15, Colors.DIM);
            await sleep(200);
        }

        await this.term.type("[+] SYSTEM READY", 20, Colors.GREEN);
        await sleep(500);

        // Check for save
        if (GameState.load()) {
            this.term.print("\n[+] Previous session restored.", Colors.GREEN);
            this.term.print(`    Welcome back, ${GameState.username}.`, Colors.CYAN);
            this.term.setPrompt(GameState.username);
            this.showHelp();
        } else {
            await this.term.type("\nFirst time? Enter your handle:", 30);
            this.term.requestInput((name) => {
                GameState.username = name.trim() || "Anon";
                this.term.setPrompt(GameState.username);
                this.term.print(`\nIdentity confirmed: ${GameState.username}`, Colors.GREEN);
                this.story.checkTriggers();
                this.showHelp();
            });
        }
    }

    showHelp() {
        this.term.print("\n═══════════════════════════════════════", Colors.DIM);
        this.term.print("COMMANDS:", Colors.HEADER);
        this.term.print("  scan        - Discover network targets");
        this.term.print("  connect <ip> - Hack into a server");
        this.term.print("  missions    - View available contracts");
        this.term.print("  shop        - Dark web marketplace");
        this.term.print("  mail        - Check encrypted messages");
        this.term.print("  status      - View stats & skills");
        this.term.print("  faction     - Join/view factions");
        this.term.print("  arcade      - Minigames & training");
        this.term.print("  save        - Save progress");
        this.term.print("  help        - Show this menu");
        this.term.print("═══════════════════════════════════════", Colors.DIM);
        this.term.setInputVisible(true);
    }

    async handleCommand(cmdRaw) {
        const parts = cmdRaw.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help': this.showHelp(); break;
            case 'scan': await this.cmdScan(); break;
            case 'connect': await this.cmdConnect(args[0]); break;
            case 'missions': this.cmdMissions(args); break;
            case 'shop': this.shop.list(this.term); break;
            case 'buy': this.shop.buy(args[0], this.term, this.audio); break;
            case 'mail': this.cmdMail(args); break;
            case 'status': this.cmdStatus(); break;
            case 'faction': this.cmdFaction(args); break;
            case 'arcade': this.cmdArcade(args); break;
            case 'save': this.cmdSave(); break;
            case 'cd': this.cmdDisconnect(); break;
            case 'music': this.cmdMusic(); break;
            default:
                this.term.print(`Unknown command: ${cmd}`, Colors.FAIL);
                this.term.print("Type 'help' for available commands.", Colors.DIM);
        }
    }

    async cmdScan() {
        this.term.print("Scanning network...", Colors.CYAN);
        this.audio.playHack();
        await sleep(1500);

        const visibleTiers = Math.min(GameState.currentAct, 4);
        this.term.print("\n═══ NETWORK SCAN RESULTS ═══", Colors.HEADER);
        this.term.print("IP               | HOSTNAME             | TIER | DIFF");
        this.term.print("─".repeat(60));

        this.network.servers.forEach(s => {
            if (s.tier > 0 && s.tier <= visibleTiers) {
                const status = s.hacked ? "[OWNED]" : "";
                this.term.print(`${s.ip.padEnd(16)} | ${s.hostname.padEnd(20)} | T${s.tier}   | ${s.difficulty} ${status}`);
            }
        });

        if (visibleTiers < 4) {
            this.term.print(`\n[?] ${4 - visibleTiers} tier(s) hidden. Progress the story to reveal.`, Colors.DIM);
        }
    }

    async cmdConnect(ip) {
        if (!ip) {
            this.term.print("Usage: connect <ip>", Colors.FAIL);
            return;
        }

        const server = this.network.findServer(ip);
        if (!server) {
            this.term.print("Host not found.", Colors.FAIL);
            this.audio.playAccessDenied();
            return;
        }

        // Check tier access
        if (server.tier >= 3 && !GameState.unlockedTools.includes('rootkit')) {
            this.term.print("Access denied. Need RootKit for Tier 3+ servers.", Colors.FAIL);
            return;
        }
        if (server.tier >= 4 && !GameState.unlockedTools.includes('zeroday')) {
            this.term.print("Access denied. Need Zero-Day for Tier 4 servers.", Colors.FAIL);
            return;
        }

        this.term.print(`Connecting to ${server.hostname}...`, Colors.CYAN);
        this.audio.music.setIntensity(2);
        await sleep(1000);

        // Minigame based on difficulty
        let success = false;
        if (server.difficulty <= 2) {
            success = await this.minigames.startBruteForce(server.difficulty);
        } else if (server.difficulty <= 5) {
            const game = randomChoice(['bruteforce', 'sqli']);
            if (game === 'bruteforce') success = await this.minigames.startBruteForce(server.difficulty);
            else success = await this.minigames.startSQLi(server.difficulty);
        } else {
            const game = randomChoice(['sqli', 'crypto', 'maze']);
            if (game === 'sqli') success = await this.minigames.startSQLi(server.difficulty);
            else if (game === 'crypto') success = await this.minigames.startCrypto(server.difficulty);
            else success = await this.minigames.startFirewallMaze(server.difficulty);
        }

        this.audio.music.setIntensity(1);

        if (success) {
            this.onHackSuccess(server);
        } else {
            this.term.print("Connection terminated.", Colors.FAIL);
        }
    }

    onHackSuccess(server) {
        if (!server.hacked) {
            server.hacked = true;
            GameState.serversHacked.push(server.ip);
            GameState.money += server.loot.money;
            GameState.xp += server.loot.xp;
            GameState.reputation += server.difficulty * 10;

            this.term.print(`\n[+] SERVER COMPROMISED: ${server.hostname}`, Colors.GREEN);
            this.term.print(`    Loot: +$${server.loot.money} | +${server.loot.xp} XP`, Colors.CYAN);

            // Level up check
            const xpNeeded = GameState.level * 100;
            if (GameState.xp >= xpNeeded) {
                GameState.level++;
                GameState.xp -= xpNeeded;
                this.term.print(`\n[!] LEVEL UP! Now Level ${GameState.level}`, Colors.HEADER);
                this.audio.playLevelUp();
            }

            // Check for mission completion
            if (GameState.activeMission && GameState.activeMission.targetIP === server.ip) {
                GameState.money += GameState.activeMission.reward;
                this.missions.complete(GameState.activeMission.id);
                this.term.print(`\n[+] MISSION COMPLETE: +$${GameState.activeMission.reward}`, Colors.GREEN);
                GameState.activeMission = null;
            }

            // Story triggers
            this.story.checkTriggers();
            GameState.save();
        } else {
            this.term.print("Server already compromised. No new loot.", Colors.DIM);
        }
    }

    cmdMissions(args) {
        if (args[0] === 'accept' && args[1]) {
            const id = parseInt(args[1]);
            const mission = this.missions.allMissions.find(m => m.id === id);
            if (mission && !mission.completed) {
                if (GameState.activeMission) {
                    this.term.print("Already have active mission. Complete it first.", Colors.WARNING);
                    return;
                }
                GameState.activeMission = mission;
                this.term.print(`[+] Mission accepted: ${mission.title}`, Colors.GREEN);
                this.term.print(`    Target: ${mission.targetIP} | Reward: $${mission.reward}`, Colors.CYAN);
            } else {
                this.term.print("Mission not found or completed.", Colors.FAIL);
            }
            return;
        }

        this.term.print("═══ AVAILABLE CONTRACTS ═══", Colors.HEADER);
        const available = this.missions.getAvailable(GameState.level, GameState.currentAct);

        if (available.length === 0) {
            this.term.print("No contracts available. Level up or progress the story.", Colors.DIM);
        } else {
            available.forEach(m => {
                this.term.print(`[ID:${m.id}] ${m.title} - $${m.reward} (Diff: ${m.difficulty})`);
            });
            this.term.print("\nUsage: missions accept <id>", Colors.DIM);
        }

        if (GameState.activeMission) {
            this.term.print(`\n[ACTIVE] ${GameState.activeMission.title}`, Colors.WARNING);
        }
    }

    cmdMail(args) {
        if (args[0] === 'read' && args[1] !== undefined) {
            const content = this.mail.readMail(parseInt(args[1]));
            if (content) this.term.print(content);
            else this.term.print("Message not found.", Colors.FAIL);
            return;
        }

        this.term.print("═══ INBOX ═══", Colors.HEADER);
        const unread = this.mail.getUnreadCount();
        this.term.print(`Unread: ${unread}`, unread > 0 ? Colors.WARNING : Colors.DIM);
        this.mail.listMail().forEach(line => this.term.print(line));
        this.term.print("\nUsage: mail read <id>", Colors.DIM);
    }

    cmdStatus() {
        this.term.print("═══ SYSTEM STATUS ═══", Colors.HEADER);
        this.term.print(`USER: ${GameState.username} | LEVEL: ${GameState.level} (${GameState.xp} XP)`);
        this.term.print(`MONEY: ${formatCurrency(GameState.money)} | REP: ${GameState.reputation}`);
        this.term.print(`\nSTORY: Act ${GameState.currentAct} - ${STORY_DATA.acts[GameState.currentAct]?.name || "?"}`);

        this.term.print("\nSKILLS:", Colors.CYAN);
        Object.entries(GameState.skills).forEach(([skill, val]) => {
            const bar = "█".repeat(Math.floor(val)) + "░".repeat(10 - Math.floor(val));
            this.term.print(`  ${skill.padEnd(10)} [${bar}] ${val.toFixed(1)}`);
        });

        this.term.print(`\nSERVERS HACKED: ${GameState.serversHacked.length}`);
        this.term.print(`INVENTORY: ${GameState.inventory.join(', ') || 'None'}`);

        const playtime = Math.floor((GameState.totalPlayTime + Date.now() - GameState.sessionStart) / 60000);
        this.term.print(`\nPLAYTIME: ${playtime} minutes`);
    }

    cmdFaction(args) {
        if (args[0] === 'join' && args[1]) {
            const factionKey = args[1].toLowerCase();
            if (GameState.factions[factionKey]) {
                if (GameState.activeFaction) {
                    this.term.print("Already aligned with a faction!", Colors.WARNING);
                } else if (GameState.serversHacked.length < 3) {
                    this.term.print("Prove yourself first. Hack more servers.", Colors.FAIL);
                } else {
                    GameState.activeFaction = factionKey;
                    const faction = GameState.factions[factionKey];
                    this.term.print(`\n[+] JOINED: ${faction.name}`, faction.color);
                    this.audio.playSuccess();
                    this.story.checkTriggers();
                }
            } else {
                this.term.print("Unknown faction.", Colors.FAIL);
            }
            return;
        }

        this.term.print("═══ FACTIONS ═══", Colors.HEADER);
        Object.entries(GameState.factions).forEach(([key, f]) => {
            const status = GameState.activeFaction === key ? "[JOINED]" : "";
            this.term.print(`${key.padEnd(12)} | ${f.name} ${status}`, f.color);
        });
        this.term.print("\nJoin: faction join <syndicate|rebels|corp>", Colors.DIM);
    }

    cmdArcade(args) {
        if (args[0] === 'maze') {
            this.minigames.startFirewallMaze(GameState.level);
            return;
        }
        if (args[0] === 'crypto') {
            this.minigames.startCrypto(GameState.level);
            return;
        }

        this.term.print("═══ ARCADE / TRAINING ═══", Colors.HEADER);
        this.term.print("  arcade maze   - Firewall infiltration");
        this.term.print("  arcade crypto - Cryptography training");
    }

    cmdSave() {
        GameState.save();
        this.term.print("[+] Progress saved to local storage.", Colors.GREEN);
        this.audio.playSuccess();
    }

    cmdDisconnect() {
        if (GameState.connectedServer) {
            GameState.connectedServer = null;
            this.term.print("Disconnected.", Colors.DIM);
            this.term.setPrompt(GameState.username);
        } else {
            this.term.print("Not connected to any server.", Colors.DIM);
        }
    }

    cmdMusic() {
        const enabled = this.audio.toggleMusic();
        this.term.print(`Music: ${enabled ? 'ON' : 'OFF'}`, Colors.DIM);
    }
}

// Initialize Game
window.game = new Game();
