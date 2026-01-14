export class VoidScriptInterpreter {
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
