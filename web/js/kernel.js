export class Kernel {
    constructor() {
        this.processes = [];
        this.memory = new MemoryManager(1024 * 1024); // 1GB fake RAM
        this.drivers = [];
        this.ticks = 0;
    }

    boot() {
        this.log("Kernel initializing...");
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
        this.memory.allocate(proc, 1024); // Allocate 1KB fake
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
        // Simulate complex logic
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
