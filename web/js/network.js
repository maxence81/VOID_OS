import { generateIP, randomChoice, randomInt } from './utils.js';
import { FileSystem } from './filesystem.js';

export class Server {
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
        // Always SSH
        ports.push({ port: 22, service: 'SSH', open: true, version: 'OpenSSH 8.4' });

        if (this.difficulty > 2) ports.push({ port: 80, service: 'HTTP', open: true });
        if (this.difficulty > 4) ports.push({ port: 21, service: 'FTP', open: true });
        if (this.difficulty > 6) ports.push({ port: 3306, service: 'MySQL', open: false });

        return ports;
    }
}

export class Network {
    constructor() {
        this.servers = [];
        this.generateWorld();
    }

    generateWorld() {
        // Corp
        for (let i = 0; i < 5; i++) {
            this.servers.push(new Server(generateIP(), `Corp_Node_${i}`, randomInt(1, 3)));
        }
        // Gov
        for (let i = 0; i < 3; i++) {
            this.servers.push(new Server(generateIP(), `Gov_Secure_${i}`, randomInt(5, 8)));
        }
        // Special
        this.servers.push(new Server("8.8.8.8", "Google_DNS", 99));
    }

    findServer(ip) {
        return this.servers.find(s => s.ip === ip);
    }
}
