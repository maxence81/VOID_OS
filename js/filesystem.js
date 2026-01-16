import { Colors } from './utils.js';
class File {
    constructor(name, content = "", type = "text") {
        this.name = name;
        this.content = content;
        this.type = type; // text, binary, encrypted
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
export class FileSystem {
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