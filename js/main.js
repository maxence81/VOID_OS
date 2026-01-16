import { Terminal } from './terminal.js';
import { Network } from './network.js';
import { MissionSystem } from './missions.js';
import { AudioSystem } from './audio.js';
import { MailSystem } from './mail.js';
import { StoryController } from './story.js';
import { Colors, sleep } from './utils.js';
class Game {
    constructor() {
        this.term = new Terminal();
        this.network = new Network();
        this.missions = new MissionSystem();
        this.audio = new AudioSystem();
        this.mail = new MailSystem();
        this.story = new StoryController(this.mail, this.term);
        this.state = {
            username: "GUEST",
            money: 0,
            rep: 0,
            connectedServer: null
        };
        // Hook audio to terminal
        this.term.onType = () => this.audio.playKeySound();
        this.init();
    }
    async init() {
        // Event Listener for commands
        document.addEventListener('terminal-command', (e) => this.handleCommand(e.detail));
        // Enable audio on first click (browser policy)
        document.body.addEventListener('click', () => {
            if (this.audio.ctx.state === 'suspended') this.audio.ctx.resume();
        }, { once: true });
        this.term.setInputVisible(false);
        await this.bootSequence();
    }
    async bootSequence() {
        this.audio.playBoot();
        this.term.printLogo();
        await this.term.type("Welcome to VOID_OS 2.5 (Contest Edition)", 30, Colors.HEADER);
        console.log("Booting...");
        await sleep(500);
        // Load Save
        const saved = localStorage.getItem('void_os_save_v2');
        if (saved) {
            const data = JSON.parse(saved);
            this.state = data.state;
            // Restore inventory/mail logic here in full version
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
                this.story.checkTriggers(this.state); // Trigger initial story
                this.mainHelp();
            });
        }
    }
    mainHelp() {
        this.term.print("\nCOMMANDS:", Colors.HEADER);
        this.term.print("  scan      : Discover networks");
        this.term.print("  connect <ip> : Target a system");
        this.term.print("  missions  : View contracts");
        this.term.print("  mail      : Check inbox");
        this.term.print("  help      : This menu");
        this.term.setInputVisible(true);
    }
    async handleCommand(cmdRaw) {
        const parts = cmdRaw.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        if (cmd === 'help') {
            this.mainHelp();
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
        else if (cmd === 'scan') {
            this.term.print("Scanning...", Colors.CYAN);
            this.audio.playTone(400, 'square', 0.1);
            await sleep(1000);
            this.audio.playTone(600, 'square', 0.1);
            this.network.servers.forEach(s => {
                this.term.print(`${s.ip.padEnd(16)} | ${s.hostname}`);
            });
        }
        else if (cmd === 'missions') {
            this.missions.availableMissions.forEach(m => {
                this.term.print(`[ID:${m.id}] ${m.title} - $${m.reward}`);
            });
        }
        else if (cmd === 'connect') {
            const ip = args[0];
            if (!ip) {
                this.term.print("Usage: connect <ip>", Colors.FAIL);
                this.audio.playAccessDenied();
                return;
            }
            const target = this.network.findServer(ip);
            if (target) {
                this.term.print(`Connecting to ${target.hostname}...`, Colors.DIM);
                await sleep(1000);
                this.term.print("Access Granted.", Colors.GREEN);
                this.audio.playAccessGranted();
                this.state.connectedServer = target;
                this.story.checkTriggers(this.state); // Check story events
            } else {
                this.term.print("Host unreachable.", Colors.FAIL);
                this.audio.playAccessDenied();
            }
        }
        else {
            this.term.print("Unknown command.", Colors.FAIL);
        }
    }
}
window.game = new Game();