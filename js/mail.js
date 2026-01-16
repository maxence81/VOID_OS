import { Colors } from './utils.js';
export class Mail {
    constructor(sender, subject, body, read = false) {
        this.sender = sender;
        this.subject = subject;
        this.body = body;
        this.read = read;
        this.timestamp = new Date().toLocaleTimeString();
    }
}
export class MailSystem {
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
    readMail(index, term) {
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