import { Colors } from './utils.js';

export class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.inputLine = document.querySelector('.input-line');
        this.inputField = document.getElementById('command-input');
        this.promptUser = document.getElementById('prompt-user');
        this.terminalDiv = document.getElementById('terminal');
        this.inputCallback = null;

        this.setupListeners();
    }

    setupListeners() {
        this.inputField.addEventListener('keydown', (e) => {
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
    }

    clear() {
        this.output.innerHTML = '';
    }

    print(text, className = '') {
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
