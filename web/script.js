
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const inputField = document.getElementById('command-input');
const promptUser = document.getElementById('prompt-user');

// --- Game State ---
const state = {
    username: "GUEST",
    level: 1,
    reputation: 0,
    money: 0,
    connected_server: null,
    inventory: [],
    mission_log: [],
    isRunning: true
};

// --- Utilities ---
const Colors = {
    HEADER: 'header',
    BLUE: 'blue',
    CYAN: 'cyan',
    GREEN: 'green',
    WARNING: 'warn',
    FAIL: 'fail',
    ENDC: '',
    BOLD: 'bold'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function clearScreen() {
    output.innerHTML = '';
}

function print(text, className = '') {
    const p = document.createElement('div');
    if (className) p.classList.add(className);

    // Convert newlines to breaks if it's plain text, but usually we handle pre-formatted strings
    // Simple HTML safety
    p.textContent = text;

    // If text contains ASCII art or needs whitespace preservation
    if (text.includes('█') || text.includes('>>')) {
        p.innerHTML = `<pre>${text}</pre>`;
    }

    output.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
}

function printHTML(html) {
    const p = document.createElement('div');
    p.innerHTML = html;
    output.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
}

async function typeWriter(text, speed = 30, className = '') {
    const p = document.createElement('div');
    if (className) p.classList.add(className);
    output.appendChild(p);

    for (let char of text) {
        p.textContent += char;
        terminal.scrollTop = terminal.scrollHeight;
        await sleep(speed);
    }
}

async function loadingBar(duration, message = "Processing") {
    const p = document.createElement('div');
    p.textContent = message + " [";
    output.appendChild(p);

    const bar = document.createElement('span');
    p.appendChild(bar);
    p.appendChild(document.createTextNode("]"));

    const totalSteps = 20;
    for (let i = 0; i < totalSteps; i++) {
        bar.textContent += "=";
        await sleep(duration * 1000 / totalSteps);
    }

    const done = document.createElement('span');
    done.textContent = " DONE";
    done.classList.add('green');
    p.appendChild(done);
    terminal.scrollTop = terminal.scrollHeight;
    print(""); // New line
}

// --- Content ---
const LOGO = `
    ██╗   ██╗ ██████╗ ██╗██████╗         ██████╗ ███████╗
    ██║   ██║██╔═══██╗██║██╔══██╗       ██╔═══██╗██╔════╝
    ██║   ██║██║   ██║██║██║  ██║       ██║   ██║███████╗
    ╚██╗ ██╔╝██║   ██║██║██║  ██║       ██║   ██║╚════██║
     ╚████╔╝ ╚██████╔╝██║██████╔╝       ╚██████╔╝███████║
      ╚═══╝   ╚═════╝ ╚═╝╚═════╝         ╚═════╝ ╚══════╝
`;

function printLogo() {
    printHTML(`<pre class="cyan">${LOGO}</pre>`);
    print("    >> TERMINAL ACCESS GRANTED <<", "green");
    print("    >> VERSION 1.0.0 <<", "blue");
    print("");
}

// --- Logic ---
async function bootSequence() {
    clearScreen();
    // Ensure input is hidden at start
    document.querySelector('.input-line').style.display = 'none';

    printLogo();

    // Check local storage
    const saved = localStorage.getItem('void_os_save');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        print("    [+] Save file loaded.", "green");
        await sleep(500);
        updatePrompt();
        mainMenu();
        return;
    }

    await sleep(1000);
    await typeWriter("Welcome to VOID_OS.", 50, "header");
    await typeWriter("Initializing kernel...", 50);
    await sleep(500);
    await typeWriter("Loading modules...", 50);
    await sleep(500);
    await typeWriter("Bypassing firewalls...", 50);
    await sleep(1000);

    if (state.username === "GUEST") {
        await typeWriter("Enter your handle, hacker:", 30);
        // Wait for input manually via a special state or prompt?
        // Since we are web, we can just block for now or assume next input is name
        requestInput(async (name) => {
            if (name.trim()) state.username = name.trim();
            updatePrompt();
            await typeWriter(`Identity confirmed. Welcome, ${state.username}.`, 30);
            await sleep(1000);
            mainMenu();
        });
        return;
    }
}

function updatePrompt() {
    promptUser.textContent = state.username;
    promptUser.className = "green";
}

let inputCallback = null;

function requestInput(callback) {
    const inputLine = document.querySelector('.input-line');
    inputLine.style.display = 'flex'; // Show input
    inputField.value = '';
    inputField.disabled = false;
    inputField.focus();
    inputCallback = callback;
}

inputField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const val = inputField.value;
        print(`${state.username}@void:~$ ${val}`, 'dim'); // Echo

        inputField.value = '';
        if (inputCallback) {
            const cb = inputCallback;
            inputCallback = null;
            cb(val);
        } else {
            handleCommand(val);
        }
    }
});

async function mainMenu() {
    clearScreen();
    printLogo();
    printHTML(`<span class="bold">USER: ${state.username} | LEVEL: ${state.level} | REP: ${state.reputation} | $: ${state.money}</span>`);
    print("-".repeat(60));
    print("Available Commands:");
    print("1. [scan]     - Scan for vulnerable IP addresses");
    print("2. [connect]  - Connect to a target server");
    print("3. [jobs]     - Check the Dark Web for contracts");
    print("4. [market]   - Buy exploits and hardware");
    print("5. [status]   - View system status and inventory");
    print("6. [manual]   - Read the hacker manual");
    print("7. [save]     - Save progress to browser");
    print("8. [reset]    - Reset save data");
    print("-".repeat(60));
    // Ready for command
}

async function handleCommand(cmd) {
    cmd = cmd.toLowerCase().trim();

    if (!cmd) return;

    if (cmd === "scan" || cmd === "1") {
        await scanNetwork();
    } else if (cmd === "connect" || cmd === "2") {
        await connectServer();
    } else if (cmd === "jobs" || cmd === "3") {
        await checkJobs();
    } else if (cmd === "market" || cmd === "4") {
        await darkMarket();
    } else if (cmd === "status" || cmd === "5") {
        showStatus();
    } else if (cmd === "manual" || cmd === "6") {
        print("Manual not found. V1.0 Docs pending.", "warn");
    } else if (cmd === "save" || cmd === "7") {
        localStorage.setItem('void_os_save', JSON.stringify(state));
        print("[+] System State Saved to Local Storage.", "green");
    } else if (cmd === "reset" || cmd === "8") {
        localStorage.removeItem('void_os_save');
        print("[!] Save Data Wiped. Reload page to restart.", "fail");
    } else {
        print("Unknown command.", "fail");
    }
}

// --- Commands ---
const targets = [
    { ip: "192.168.0.105", name: "Corp_Guest_Wifi", difficulty: 1, reward: 50 },
    { ip: "10.0.0.55", name: "Gov_Archive_Backup", difficulty: 5, reward: 500 },
    { ip: "172.16.42.99", name: "Pizza_Shop_POS", difficulty: 2, reward: 100 },
    { ip: "8.8.8.8", name: "Google_DNS_HoneyPot", difficulty: 99, reward: 0 },
];

async function scanNetwork() {
    print("Initializing port scanner...", "cyan");
    await loadingBar(2.0, "Scanning IP Range 192.168.x.x");

    print("\nSCAN RESULTS:", "header");
    print(`IP ADDRESS           | HOSTNAME             | DIFFICULTY`);
    print("-".repeat(60));

    targets.forEach(t => {
        const stars = "*".repeat(t.difficulty);
        // Padding simulation
        const ipPad = t.ip.padEnd(20, ' ');
        const namePad = t.name.padEnd(20, ' ');
        print(`${ipPad} | ${namePad} | ${stars}`);
    });

    print("\n[Use 'connect' to interact]");
}

async function connectServer() {
    await typeWriter("Enter Target IP:", 10, "green");
    requestInput(async (ip) => {
        if (!ip) { mainMenu(); return; }

        await typeWriter(`Handshaking with ${ip}...`, 30);
        await sleep(1000);

        print("[!] PASSWORD PROTECTED", "warn");
        print("Initiating Brute Force Module...");

        const password = "admin"; // Simulated
        let cracked = false;

        // Visual hacking effect
        const pElem = document.createElement('div');
        output.appendChild(pElem);

        for (let i = 0; i < 20; i++) {
            let guess = "";
            for (let j = 0; j < 8; j++) guess += String.fromCharCode(33 + Math.floor(Math.random() * 90));
            pElem.textContent = `Trying: ${guess}...`;
            await sleep(100);
        }
        pElem.textContent = `Trying: ${password}... MATCH!`;

        print("[+] ACCESS GRANTED", "green");
        await sleep(1000);

        hackingInterface(ip);
    });
}

function hackingInterface(ip) {
    clearScreen();
    print(`CONNECTED TO: ${ip}`, "fail");
    print("1. [download] - Steal Data");
    print("2. [upload]   - Install Virus");
    print("3. [disconnect]");

    requestInput(async (act) => {
        act = act.toLowerCase().trim();
        if (act === "download" || act === "1") {
            await loadingBar(3, "Downloading user_data.db");
            const cash = Math.floor(Math.random() * 150) + 50;
            state.money += cash;
            state.reputation += 10;
            print(`[+] $${cash} and 500MB Data Stolen.`, "green");
            await sleep(1000);
            hackingInterface(ip);
        } else if (act === "upload" || act === "2") {
            await loadingBar(2, "Uploading trojan.exe");
            print("[+] Backdoor installed.", "green");
            state.reputation += 20;
            await sleep(1000);
            hackingInterface(ip);
        } else {
            mainMenu();
        }
    });
}

async function checkJobs() {
    clearScreen();
    print("DARK WEB CONTRACTS", "header");
    print("1. Deface 'School_Website' (Reward: $50)");
    print("2. Dox 'Mean_Moderator' (Reward: $100)");
    print("3. Hack 'Bank_Mainframe' (Reward: $9999) - LEVEL 50 REQUIRED");
    print("\n[Press Enter to return]");
    requestInput(() => mainMenu());
}

async function darkMarket() {
    clearScreen();
    print("ZERO DAY MARKET", "header");
    print("1. ScriptKiddie Toolset ($50)");
    print("2. SQL Injection Automator ($200)");

    print("\nBuy item (ID) or Enter to return:");
    requestInput((choice) => {
        if (choice === "1") {
            if (state.money >= 50) {
                state.money -= 50;
                state.inventory.push("ScriptKiddie Toolset");
                print("Purchased!", "green");
            } else print("Not enough funds.", "fail");
        }
        else if (choice === "2") {
            if (state.money >= 200) {
                state.money -= 200;
                state.inventory.push("SQL Auto");
                print("Purchased!", "green");
            } else print("Not enough funds.", "fail");
        }
        setTimeout(mainMenu, 1000);
    });
}

function showStatus() {
    clearScreen();
    print(`Stats for ${state.username}`);
    print(`Money: $${state.money}`);
    print(`Reputation: ${state.reputation}`);
    print(`Inventory: ${state.inventory.join(', ')}`);
    print("\n[Press Enter to return]");
    requestInput(() => mainMenu());
}

// Start
bootSequence();
