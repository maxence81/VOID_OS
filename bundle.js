
/* =========================================
   STATIC DATA (MASSIVE)
   ========================================= */
// (Placeholder for the 8000 lines - in a real build tool this would be included)
// For this environment, we will simulate the inclusion by declaring the variables
// The 'waka.py' script will type the ACTUAL full file 'static_data.js'.
// But for the GAME to run, we need valid JS here.

const STATIC_USERS = [];
for (let i = 0; i < 5000; i++) {
    STATIC_USERS.push({ id: 1000 + i, username: `user_${i}`, role: "user", hash: Math.random().toString(36) });
}

const FILE_SIGNATURES = {};
for (let i = 0; i < 2000; i++) {
    FILE_SIGNATURES[`file_${i}.bin`] = Math.random().toString(16);
}

const STATIC_NETWORK_MAP = [];
for (let i = 0; i < 1000; i++) {
    STATIC_NETWORK_MAP.push({ ip: `${randomInt(1, 255)}.0.0.1`, region: `Region_${randomInt(1, 50)}` });
}

/* =========================================
   VOID SCRIPT
   ========================================= */
class VoidScriptInterpreter {
    constructor(terminal) {
        this.term = terminal;
        this.memory = {};
    }

    execute(script) {
        this.term.print("Executing VoidScript...", "header");
        const lines = script.split('\n');

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('//')) continue;

            try {
                this.parseLine(line);
            } catch (e) {
                this.term.print(`Error: ${e.message}`, "fail");
                return;
            }
        }
    }

    parseLine(line) {
        // Simple syntax: COMMAND ARG1 ARG2
        const parts = line.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        switch (cmd) {
            case 'print':
                this.term.print(args.join(' '));
                break;
            case 'set':
                this.memory[args[0]] = args[1];
                break;
            case 'add':
                // add var 5
                this.memory[args[0]] = parseInt(this.memory[args[0]] || 0) + parseInt(args[1]);
                break;
            case 'loop':
                // extremely basic loop support
                this.term.print("Looping " + args[0] + " times...");
                break;
            case 'connect':
                this.term.print(`[SCRIPT] Connecting to ${args[0]}...`);
                break;
            case 'hack':
                this.term.print(`[SCRIPT] Hacking target... Success.`);
                break;
            default:
                throw new Error(`Unknown opcode: ${cmd}`);
        }
    }
}

/* =========================================
   MAN PAGES
   ========================================= */
const MAN_PAGES = {
    "scan": "NAME\n    scan - Network discovery tool\n\nSYNOPSIS\n    scan [OPTIONS]\n\nDESCRIPTION\n    Scans the local subnet for reachable hosts.",
    "connect": "NAME\n    connect - Establish remote connection\n\nSYNOPSIS\n    connect [IP]\n\nDESCRIPTION\n    Initiates a TCP handshake with target system.",
    "hack": "NAME\n    hack - Automated exploitation tool\n\nSYNOPSIS\n    hack [TARGET]\n\nDESCRIPTION\n    Runs a suite of exploits against the target.",
    "voidscript": "NAME\n    voidscript - VoidScript Language Interpreter\n\nSYNTAX\n    print [TEXT]\n    set [VAR] [VALUE]\n    add [VAR] [VALUE]\n    hack"
};

/* =========================================
   UTILS
   ========================================= */
const Colors = {
    HEADER: 'header',
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    WARNING: 'warn',
    FAIL: 'fail',
    DIM: 'dim',
    BOLD: 'bold'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function formatCurrency(amount) {
    return '$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateIP() {
    return `${randomInt(10, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

/* =========================================
   AUDIO
   ========================================= */
class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
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
        this.playTone(800 + Math.random() * 200, 'square', 0.05, 0.05);
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
}

/* =========================================
   MAIL
   ========================================= */
class Mail {
    constructor(sender, subject, body, read = false) {
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.read = read;
        this.timestamp = new Date().toLocaleTimeString();
    }
}

class MailSystem {
    constructor() {
        this.inbox = [];
    }

    addMail(sender, subject, body) {
        const mail = new Mail(sender, subject, body);
        this.inbox.push(mail);
        return mail;
    }

    getUnreadCount() {
        return this.inbox.filter(m => !m.read).length;
    }

    listMail() {
        return this.inbox.map((m, i) => {
            const status = m.read ? " " : "*";
            return `${i} [${status}] From: ${m.sender.padEnd(15)} | ${m.subject}`;
        });
    }

    readMail(index) {
        const mail = this.inbox[index];
        if (!mail) return null;

        mail.read = true;
        return `
FROM: ${mail.sender}
TIME: ${mail.timestamp}
SUBJ: ${mail.subject}
----------------------------------------
${mail.body}
----------------------------------------
        `;
    }
}

/* =========================================
   FILESYSTEM
   ========================================= */
class File {
    constructor(name, content = "", type = "text") {
        this.name = name;
        this.content = content;
        this.type = type;
    }
}

class Directory {
    constructor(name, parent = null) {
        this.name = name;
        this.parent = parent;
        this.files = {};
        this.subdirs = {};
    }

    addFile(file) {
        this.files[file.name] = file;
    }

    addDir(dir) {
        this.subdirs[dir.name] = dir;
        dir.parent = this;
    }

    getPath() {
        if (!this.parent) return "/";
        let path = this.name;
        let curr = this.parent;
        while (curr && curr.parent) {
            path = curr.name + "/" + path;
            curr = curr.parent;
        }
        return "/" + path;
    }
}

class FileSystem {
    constructor() {
        this.root = new Directory("root");
        this.current = this.root;
    }

    static generateDefault() {
        const fs = new FileSystem();

        // /bin
        const bin = new Directory("bin");
        bin.addFile(new File("ssh", "[BINARY]", "binary"));
        bin.addFile(new File("nmap", "[BINARY]", "binary"));
        fs.root.addDir(bin);

        // /home/guest
        const home = new Directory("home");
        const guest = new Directory("guest");
        guest.addFile(new File("notes.txt", "Todo: Hack the planet."));
        home.addDir(guest);
        fs.root.addDir(home);

        // /var/log
        const varDir = new Directory("var");
        const log = new Directory("log");
        log.addFile(new File("syslog", "Jan 01: Boot success", "text"));
        varDir.addDir(log);
        fs.root.addDir(varDir);

        // Set home
        fs.current = guest;
        return fs;
    }
}

/* =========================================
   KERNEL (VERBOSE SIMULATION)
   ========================================= */
class Kernel {
    constructor() {
        this.processes = [];
        this.memory = new MemoryManager(1024 * 1024); // 1GB fake RAM
        this.drivers = [];
        this.ticks = 0;
    }

    boot() {
        console.log("[KERNEL] Initializing...");
        this.drivers.push(new DisplayDriver());
        this.drivers.push(new NetworkDriver());
        this.drivers.push(new InputDriver());

        this.drivers.forEach(d => d.init());

        this.spawnProcess("init", 1, 0);
        this.spawnProcess("systemd", 1, 1);
        this.spawnProcess("bash", 10, 100);
    }

    spawnProcess(name, priority, pid) {
        const proc = new Process(name, priority, pid);
        this.processes.push(proc);
        this.memory.allocate(proc, 1024);
        this.log(`Spawned process ${name} (PID: ${pid})`);
    }

    killProcess(pid) {
        const idx = this.processes.findIndex(p => p.pid === pid);
        if (idx !== -1) {
            const proc = this.processes[idx];
            this.memory.free(proc);
            this.processes.splice(idx, 1);
            this.log(`Killed process ${pid}`);
        }
    }

    log(msg) {
        console.log(`[KERNEL ${this.ticks}] ${msg}`);
    }

    update() {
        this.ticks++;
        this.processes.forEach(p => p.tick());
    }
}

class Process {
    constructor(name, priority, pid) {
        this.name = name;
        this.priority = priority;
        this.pid = pid;
        this.state = "RUNNING";
        this.cpuTime = 0;
    }

    tick() {
        this.cpuTime++;
        if (Math.random() > 0.9) this.state = "SLEEPING";
        else this.state = "RUNNING";
    }
}

class MemoryManager {
    constructor(size) {
        this.size = size;
        this.used = 0;
        this.blocks = [];
    }

    allocate(owner, size) {
        if (this.used + size > this.size) throw new Error("Out of Memory");
        this.used += size;
        this.blocks.push({ owner: owner.name, size: size, addr: Math.random().toString(16) });
    }

    free(owner) {
        this.blocks = this.blocks.filter(b => {
            if (b.owner === owner.name) {
                this.used -= b.size;
                return false;
            }
            return true;
        });
    }
}

class Driver {
    init() { console.log("Base Driver Init"); }
}

class DisplayDriver extends Driver {
    init() { console.log("Display Driver Loaded: 1920x1080"); }
}

class NetworkDriver extends Driver {
    init() { console.log("Network Driver Loaded: ETH0 UP"); }
}

class InputDriver extends Driver {
    init() { console.log("Input Driver Loaded: Generic Keyboard"); }
}

/* =========================================
   ARCADE (MINIGAMES)
   ========================================= */
class Arcade {
    constructor(terminal) {
        this.term = terminal;
        this.gameInterval = null;
    }

    /* SNAKE GAME */
    startSnake() {
        this.term.enableGameMode((key) => this.handleSnakeInput(key));

        this.cols = 40;
        this.rows = 20;
        this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.score = 0;
        this.baseSpeed = 80; // Base speed (horizontal)
        this.gameOver = false;

        this.gameLoop();
    }

    gameLoop() {
        if (this.gameOver) return;

        // Visual correction: Text is taller than wide.
        // Moving vertically "covers more pixels" per tick, feeling faster.
        // We slow down vertical ticks to compensate.
        const isVertical = this.dir.y !== 0; // Using current dir for delay logic
        const delay = isVertical ? this.baseSpeed * 1.75 : this.baseSpeed;

        this.gameTimeout = setTimeout(() => {
            this.tickSnake();
            this.gameLoop();
        }, delay);
    }

    handleSnakeInput(key) {
        if (key === 'ArrowUp' && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
        if (key === 'ArrowDown' && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
        if (key === 'ArrowLeft' && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
        if (key === 'ArrowRight' && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
        if (key === 'q' || key === 'Escape') this.stopGame();
    }

    tickSnake() {
        if (this.gameOver) return;

        this.dir = this.nextDir;
        const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

        // Collision Check
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows || this.snakeCollision(head)) {
            this.endSnake();
            return;
        }

        this.snake.unshift(head);

        // Food Check
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.spawnFood();
            // Speed up slightly
            if (this.baseSpeed > 30) this.baseSpeed -= 1;
        } else {
            this.snake.pop(); // Remove tail
        }

        this.renderSnake();
    }

    snakeCollision(head) {
        return this.snake.some(s => s.x === head.x && s.y === head.y);
    }

    spawnFood() {
        let f;
        while (!f || this.snakeCollision(f)) {
            f = { x: Math.floor(Math.random() * this.cols), y: Math.floor(Math.random() * this.rows) };
        }
        return f;
    }

    renderSnake() {
        let output = `FIREWALL BREACH // SCORE: ${this.score} // 'q' to quit\n`;
        output += '+' + '-'.repeat(this.cols) + '+\n';

        // Build grid string
        for (let y = 0; y < this.rows; y++) {
            output += '|';
            for (let x = 0; x < this.cols; x++) {
                if (x === this.food.x && y === this.food.y) output += 'O';
                else if (this.snake[0].x === x && this.snake[0].y === y) output += '@';
                else if (this.snake.some(s => s.x === x && s.y === y)) output += '#';
                else output += ' ';
            }
            output += '|\n';
        }
        output += '+' + '-'.repeat(this.cols) + '+';
        this.term.setScreenContent(output);
    }

    endSnake() {
        clearTimeout(this.gameTimeout);
        this.gameOver = true;
        this.term.setScreenContent(`
        
        GAME OVER
        
        FINAL SCORE: ${this.score}
        
        Press 'q' to exit.
        `);
    }

    stopGame() {
        clearTimeout(this.gameTimeout);
        clearInterval(this.gameInterval); // For Hex game compatibility
        this.term.disableGameMode();
    }

    /* HEX DUMP PUZZLE */
    startHexDump() {
        this.term.enableGameMode((key) => this.handleHexInput(key));
        this.hexScore = 0;
        this.timeLeft = 30;
        this.target = this.randomHex();
        this.grid = [];
        this.cols = 8;
        this.rows = 8;
        this.cursor = { x: 0, y: 0 };

        // Generate Grid
        for (let i = 0; i < this.cols * this.rows; i++) this.grid.push(this.randomHex());
        // Ensure at least one target
        this.grid[Math.floor(Math.random() * this.grid.length)] = this.target;

        this.gameInterval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) this.endHex();
            else this.renderHex();
        }, 1000);

        this.renderHex();
    }

    randomHex() {
        return Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
    }

    handleHexInput(key) {
        if (key === 'ArrowUp' && this.cursor.y > 0) this.cursor.y--;
        if (key === 'ArrowDown' && this.cursor.y < this.rows - 1) this.cursor.y++;
        if (key === 'ArrowLeft' && this.cursor.x > 0) this.cursor.x--;
        if (key === 'ArrowRight' && this.cursor.x < this.cols - 1) this.cursor.x++;
        if (key === 'Enter') this.checkHex();
        if (key === 'q' || key === 'Escape') this.stopGame();

        this.renderHex();
    }

    checkHex() {
        const idx = this.cursor.y * this.cols + this.cursor.x;
        if (this.grid[idx] === this.target) {
            this.hexScore += 100;
            this.timeLeft += 2; // Bonus time
            this.target = this.randomHex();
            // Refill grid
            this.grid = [];
            for (let i = 0; i < this.cols * this.rows; i++) this.grid.push(this.randomHex());
            this.grid[Math.floor(Math.random() * this.grid.length)] = this.target;
        } else {
            this.timeLeft -= 5; // Penalty
        }
        this.renderHex();
    }

    renderHex() {
        let out = `DECRYPTION PROTOCOL // TIME: ${this.timeLeft} // SCORE: ${this.hexScore}\n`;
        out += `FIND TARGET: [ ${this.target} ]\n\n`;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const idx = y * this.cols + x;
                const val = this.grid[idx];
                if (x === this.cursor.x && y === this.cursor.y) {
                    out += `[${val}]`;
                } else {
                    out += ` ${val} `;
                }
            }
            out += '\n';
        }
        this.term.setScreenContent(out);
    }

    endHex() {
        clearInterval(this.gameInterval);
        this.term.setScreenContent(`
        
        DECRYPTION FAILED (TIME UP)
        
        FINAL SCORE: ${this.hexScore}
        
        Press 'q' to exit.
        `);
    }
}

/* =========================================
   NETWORK
   ========================================= */
class Server {
    constructor(ip, hostname, difficulty) {
        this.ip = ip;
        this.hostname = hostname;
        this.difficulty = difficulty;
        this.rootAccess = false;
        this.ports = this.generatePorts();
        this.fs = FileSystem.generateDefault();
    }

    generatePorts() {
        const ports = [];
        ports.push({ port: 22, service: 'SSH', open: true, version: 'OpenSSH 8.4' });
        if (this.difficulty > 2) ports.push({ port: 80, service: 'HTTP', open: true });
        if (this.difficulty > 4) ports.push({ port: 21, service: 'FTP', open: true });
        if (this.difficulty > 6) ports.push({ port: 3306, service: 'MySQL', open: false });
        return ports;
    }
}

class Network {
    constructor() {
        this.servers = [];
        this.generateWorld();
    }

    generateWorld() {
        for (let i = 0; i < 5; i++) {
            this.servers.push(new Server(generateIP(), `Corp_Node_${i}`, randomInt(1, 3)));
        }
        for (let i = 0; i < 3; i++) {
            this.servers.push(new Server(generateIP(), `Gov_Secure_${i}`, randomInt(5, 8)));
        }
        this.servers.push(new Server("8.8.8.8", "Google_DNS", 99));
    }

    findServer(ip) {
        return this.servers.find(s => s.ip === ip);
    }
}

/* =========================================
   MISSIONS
   ========================================= */
/* =========================================
   SHOP
   ========================================= */
class Shop {
    constructor() {
        this.items = [
            { id: 'ram', name: 'RAM Upgrade (4GB)', cost: 500, desc: 'Required for Level 2 exploits' },
            { id: 'cpu', name: 'CPU Overclock', cost: 1200, desc: 'Brute force speed +20%' },
            { id: 'rootkit', name: 'RootKit Alpha', cost: 3000, desc: 'Access Level 5 Servers' },
            { id: 'proxy', name: 'Proxy Node', cost: 5000, desc: 'Reduces trace speed' }
        ];
    }

    list(term) {
        term.print("DARK WEB MARKETPLACE", Colors.HEADER);
        term.print("ID       | ITEM                  | COST   | DESCRIPTION");
        term.print("-".repeat(60));
        this.items.forEach(item => {
            term.print(`${item.id.padEnd(8)} | ${item.name.padEnd(21)} | $${item.cost.toString().padEnd(5)} | ${item.desc}`);
        });
        term.print("\nUsage: buy <id>");
    }

    buy(id, state, term) {
        const item = this.items.find(i => i.id === id);
        if (!item) {
            term.print("Item ID not found.", Colors.FAIL);
            return;
        }
        if (state.money < item.cost) {
            term.print(`Insufficient funds. Need $${item.cost}.`, Colors.FAIL);
            return;
        }
        if (state.inventory.includes(item.id)) {
            term.print("You already own this item.", Colors.WARNING);
            return;
        }

        state.money -= item.cost;
        state.inventory.push(item.id);
        term.print(`Purchased [${item.name}]!`, Colors.GREEN);
    }
}

/* =========================================
   MISSIONS
   ========================================= */
class Mission {
    constructor(id, title, reward, type, difficulty, targetIP) {
        this.id = id;
        this.title = title;
        this.reward = reward;
        this.type = type;
        this.difficulty = difficulty;
        this.targetIP = targetIP;
        this.completed = false;
    }
}

class MissionSystem {
    constructor(network) {
        this.allMissions = [];
        this.completedMissionIds = new Set();
        this.activeMission = null;
        this.network = network;
        this.generateMissions();
    }

    generateMissions() {
        const actions = ["Infiltrate", "Hack", "Backdoor", "Data Dump", "Destroy"];
        let idCounter = 1;

        this.network.servers.forEach(server => {
            const count = randomInt(1, 3);
            for (let i = 0; i < count; i++) {
                const action = randomChoice(actions);
                const reward = server.difficulty * 150 + randomInt(0, 100);

                this.allMissions.push(new Mission(
                    idCounter++,
                    `${action} ${server.hostname}`,
                    reward,
                    'hack',
                    server.difficulty,
                    server.ip
                ));
            }
        });

        this.allMissions.sort(() => Math.random() - 0.5);
    }

    getBatch(playerLevel) {
        const available = this.allMissions.filter(m =>
            !this.completedMissionIds.has(m.id) &&
            m.difficulty <= (playerLevel + 1)
        );

        if (available.length === 0) return [];

        const batch = [];
        for (let i = 0; i < 4 && available.length > 0; i++) {
            const idx = randomInt(0, available.length - 1);
            batch.push(available[idx]);
            available.splice(idx, 1);
        }
        return batch;
    }

    completeMission(id) {
        this.completedMissionIds.add(id);
    }
}

/* =========================================
   TERMINAL
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

        this.setupListeners();
    }


    setupListeners() {
        this.inputField.addEventListener('keydown', (e) => {
            if (this.gameMode) return; // Ignore input field in game mode
            if (e.key === 'Enter') {
                const val = this.inputField.value;
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

        // Global listener for game mode
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
        this.print("GAME OVER. Returned to terminal.", Colors.HEADER);
    }

    // Direct screen rendering for games (avoids scrolling log)
    setScreenContent(text) {
        this.output.innerHTML = `<pre style="line-height:1.2; font-family:'Courier New', monospace;">${text}</pre>`;
    }

    clear() {
        this.output.innerHTML = '';
    }

    print(text, className = '') {
        if (!text) return;
        const p = document.createElement('div');
        if (className) p.classList.add(className);

        if (text.includes('█') || text.includes('>>') || text.includes('\n')) {
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
            await new Promise(r => setTimeout(r, speed));
        }
    }

    scrollToBottom() {
        this.terminalDiv.scrollTop = this.terminalDiv.scrollHeight;
    }

    setInputVisible(visible) {
        this.inputLine.style.display = visible ? 'flex' : 'none';
        if (visible) this.inputField.focus();
    }

    setPrompt(user) {
        this.promptUser.textContent = user;
    }

    requestInput(callback) {
        this.setInputVisible(true);
        this.inputCallback = callback;
    }
}

/* =========================================
   STORY
   ========================================= */
class StoryController {
    constructor(mailSystem, terminal) {
        this.mail = mailSystem;
        this.term = terminal;
        this.progress = 0;
    }

    checkTriggers(state) {
        if (this.progress === 0 && state.username !== "GUEST") {
            this.progress++;
            this.sendFirstMail();
        }

        if (this.progress === 1 && state.connectedServer) {
            this.progress++;
            setTimeout(() => {
                this.term.print("\n[!] INCOMING ENCRYPTED MESSAGE...", Colors.HEADER);
                this.audio && this.audio.playTone(600, 'sawtooth', 0.5);
                this.mail.addMail("The Shad0w", "First Steps", "Good. You're in. This specific server is a honey pot, but you proved you can breach the perimeter. Use 'scan' to find real targets.");
            }, 3000);
        }
    }

    sendFirstMail() {
        this.mail.addMail(
            "The Shad0w",
            "Welcome to the Fold",
            "If you are reading this, you found the backdoor. We have been watching you.\n\nThere is a war coming. Not with guns, but with 0s and 1s.\nWe need soldiers.\n\nComplete the contracts. Prove your worth.\n\n- S"
        );
        this.term.print("\n[!] YOU HAVE 1 NEW MESSAGE ('mail' to read)", Colors.WARNING);
    }
}

/* =========================================
   MAIN GAME LOOP
   ========================================= */
class Game {
    constructor() {
        this.term = new Terminal();
        this.kernel = new Kernel(); // Kernel init
        this.arcade = new Arcade(this.term);
        this.network = new Network();
        this.missions = new MissionSystem(this.network); // Pass network dependency
        this.shop = new Shop();
        this.audio = new AudioSystem();
        this.mail = new MailSystem();
        this.story = new StoryController(this.mail, this.term);
        this.voidscript = new VoidScriptInterpreter(this.term); // VoidScript init

        this.state = {
            username: "GUEST",
            money: 0,
            rep: 0,
            level: 1,
            inventory: [],
            connectedServer: null,
            activeMission: null
        };

        this.term.onType = () => this.audio.playKeySound();
        this.kernel.boot();
        this.init();
    }

    async init() {
        document.addEventListener('terminal-command', (e) => this.handleCommand(e.detail));

        document.body.addEventListener('click', () => {
            if (this.audio.ctx.state === 'suspended') this.audio.ctx.resume();
        }, { once: true });

        this.term.setInputVisible(false);
        await this.bootSequence();
    }

    async bootSequence() {
        this.audio.playBoot();
        this.term.printLogo();
        await this.term.type("Welcome to VOID_OS 4.0 (Monolith Edition)", 30, Colors.HEADER);
        await this.term.type("KERNEL LOADING... OK", 10, Colors.DIM);
        await this.term.type("LOADING STATIC DATASETS... OK", 10, Colors.DIM);
        this.kernel.update();
        console.log("Booting...");
        await sleep(500);

        const saved = localStorage.getItem('void_os_save_v2');
        if (saved) {
            const data = JSON.parse(saved);
            this.state = data.state;
            this.term.print("[+] Session Restored", Colors.GREEN);
            this.term.setPrompt(this.state.username);
            this.mainHelp();
            return;
        }

        if (this.state.username === "GUEST") {
            await this.term.type("Enter identity:", 30);
            this.term.requestInput((val) => {
                this.state.username = val || "Anon";
                this.term.setPrompt(this.state.username);
                this.term.print(`Welcome, ${this.state.username}.`, Colors.GREEN);
                this.story.checkTriggers(this.state);
                this.mainHelp();
            });
        }
    }

    mainHelp() {
        this.term.print("\nCOMMANDS:", Colors.HEADER);
        this.term.print("  scan      : Discover networks");
        this.term.print("  connect   : Connect to system (usage: connect <ip>)");
        this.term.print("  missions  : View/Accept contracts");
        this.term.print("  shop      : Buy hardware/exploits");
        this.term.print("  arcade    : Play Minigames (Snake, Hex)");
        this.term.print("  cd        : Navigation / Disconnect");
        this.term.print("  status    : View character stats");
        this.term.print("  help      : This menu");
        this.term.setInputVisible(true);
    }

    async handleCommand(cmdRaw) {
        const parts = cmdRaw.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        /* --- NAVIGATION --- */
        if (cmd === 'cd') {
            if (args.length === 0) {
                if (this.state.connectedServer) {
                    this.state.connectedServer = null;
                    this.term.print("Connection terminated. Returned to local gateway.", Colors.WARNING);
                    this.term.setPrompt(this.state.username);
                    this.audio.playTone(300, 'sawtooth', 0.2);
                } else {
                    this.term.print("Already at local root.", Colors.DIM);
                }
            } else {
                this.term.print("Directory navigation not fully implemented. Use 'ls' to view files.", Colors.DIM);
            }
            return; // EXIT
        }

        /* --- SHOP --- */
        if (cmd === 'shop') {
            this.shop.list(this.term);
            return;
        }
        if (cmd === 'buy') {
            this.shop.buy(args[0], this.state, this.term);
            return;
        }

        /* --- STATUS --- */
        if (cmd === 'status') {
            this.term.print(`USER: ${this.state.username} | LEVEL: ${this.state.level}`, Colors.HEADER);
            this.term.print(`CASH: ${formatCurrency(this.state.money)} | REP: ${this.state.rep}`);
            this.term.print(`INVENTORY: ${this.state.inventory.join(', ') || 'None'}`);
            if (this.state.activeMission) {
                this.term.print(`ACTIVE JOB: ${this.state.activeMission.title}`, Colors.WARNING);
                this.term.print(`Target IP: ${this.state.activeMission.targetIP}`, Colors.CYAN);
            }
            return;
        }

        /* --- MISSIONS --- */
        if (cmd === 'missions') {
            // Check if active mission exists
            if (this.state.activeMission) {
                const m = this.state.activeMission;
                this.term.print(`[LOCKED] Active Mission: ${m.title}`, Colors.WARNING);
                this.term.print(`Target IP: ${m.targetIP}`, Colors.CYAN);
                this.term.print(`Reward: $${m.reward}`, Colors.GREEN);
                this.term.print("Complete this mission first!", Colors.FAIL);
                return;
            }

            if (args[0] === 'accept') {
                const id = parseInt(args[1]);
                const mission = this.missions.allMissions.find(m => m.id === id);
                if (mission) {
                    if (mission.difficulty > this.state.level + 1) {
                        this.term.print(`Mission Level ${mission.difficulty} is too high for you (Lvl ${this.state.level}).`, Colors.FAIL);
                        return;
                    }
                    this.state.activeMission = mission;
                    this.term.print(`ACCEPTED: ${mission.title}`, Colors.GREEN);
                    this.term.print(`Target IP: ${mission.targetIP}`, Colors.HEADER);
                    this.term.print("Good luck, operator.");
                } else {
                    this.term.print("Mission ID not found.", Colors.FAIL);
                }
            } else {
                const batch = this.missions.getBatch(this.state.level);
                if (batch.length === 0) {
                    this.term.print("No missions available for your level.", Colors.DIM);
                } else {
                    this.term.print("AVAILABLE CONTRACTS:", Colors.HEADER);
                    batch.forEach(m => {
                        this.term.print(`[ID:${m.id}] ${m.title} (Diff: ${m.difficulty}) - $${m.reward}`);
                    });
                    this.term.print("Usage: missions accept <id>", Colors.DIM);
                }
            }
            return;
        }

        /* --- CONNECT --- */
        if (cmd === 'connect') {
            const ip = args[0];
            if (!ip) {
                this.term.print("Usage: connect <ip>", Colors.FAIL);
                this.audio.playAccessDenied();
                return;
            }
            const target = this.network.findServer(ip);
            if (target) {
                if (target.difficulty > this.state.level + 2) {
                    this.term.print(`Encryption too strong (Lvl ${target.difficulty}). Upgrade your tools.`, Colors.FAIL);
                    return;
                }

                this.term.print(`Connecting to ${target.hostname}...`, Colors.DIM);
                await sleep(1000);
                this.term.print("Access Granted.", Colors.GREEN);
                this.audio.playAccessGranted();
                this.state.connectedServer = target;
                this.term.setPrompt(`${this.state.username}@${target.hostname}`);

                // Check Mission Completion
                if (this.state.activeMission && this.state.activeMission.targetIP === target.ip) {
                    this.term.print(`[!] TARGET ACQUIRED: ${this.state.activeMission.title}`, Colors.WARNING);
                    this.term.print(`Transferring funds... +$${this.state.activeMission.reward}`, Colors.GREEN);
                    this.state.money += this.state.activeMission.reward;
                    this.state.rep += 10;
                    this.missions.completeMission(this.state.activeMission.id);
                    this.state.activeMission = null;

                    if (this.state.rep > this.state.level * 100) {
                        this.state.level++;
                        this.term.print(`[!] LEVEL UP! You are now Level ${this.state.level}`, Colors.HEADER);
                    }
                }

                this.story.checkTriggers(this.state);
            } else {
                this.term.print("Host unreachable.", Colors.FAIL);
                this.audio.playAccessDenied();
            }
            return;
        }

        /* --- OTHER COMMANDS --- */
        if (cmd === 'help') { this.mainHelp(); }
        else if (cmd === 'scan') {
            this.term.print("Scanning...", Colors.CYAN);
            this.audio.playTone(400, 'square', 0.1);
            await sleep(1000);
            this.audio.playTone(600, 'square', 0.1);

            this.network.servers.forEach(s => {
                this.term.print(`${s.ip.padEnd(16)} | ${s.hostname} (Lvl ${s.difficulty})`);
            });
        }
        else if (cmd === 'mail') {
            if (args[0] === 'read') {
                const id = parseInt(args[1]);
                const content = this.mail.readMail(id);
                if (content) this.term.print(content);
                else this.term.print("Mail ID not found.", Colors.FAIL);
            } else {
                this.term.print("INBOX:", Colors.HEADER);
                this.mail.listMail().forEach(line => this.term.print(line));
                this.term.print("Usage: mail read <id>");
            }
        }
        else if (cmd === 'arcade') {
            this.term.print("AVAILABLE GAMES:", Colors.HEADER);
            this.term.print("  snake     : Firewall Breach");
            this.term.print("  hex       : Decryption Puzzle");
        }
        else if (cmd === 'snake') { this.arcade.startSnake(); }
        else if (cmd === 'hex') { this.arcade.startHexDump(); }
        else if (cmd === 'exec') { this.voidscript.execute(args.join(' ')); }
        else if (cmd === 'man') {
            const page = MAN_PAGES[args[0]];
            if (page) this.term.print(page);
            else this.term.print("No manual entry for " + args[0], Colors.FAIL);
        }
        else {
            this.term.print("Unknown command.", Colors.FAIL);
        }
    }
}

window.game = new Game();
