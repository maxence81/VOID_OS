import { MailSystem } from './mail.js';
export class StoryController {
    constructor(mailSystem, terminal) {
        this.mail = mailSystem;
        this.term = terminal;
        this.progress = 0;
    }
    checkTriggers(state) {
        // Trigger 1: First Login
        if (this.progress === 0 && state.username !== "GUEST") {
            this.progress++;
            this.sendFirstMail();
        }
        // Trigger 2: Connected to first server
        if (this.progress === 1 && state.connectedServer) {
            this.progress++;
            setTimeout(() => {
                this.term.print("\n[!] INCOMING ENCRYPTED MESSAGE...", "header");
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
        this.term.print("\n[!] YOU HAVE 1 NEW MESSAGE ('mail' to read)", "warn");
    }
}