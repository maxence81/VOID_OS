import { randomChoice, randomInt, formatCurrency } from './utils.js';

export class Mission {
    constructor(id, title, reward, type, difficulty) {
        this.id = id;
        this.title = title;
        this.reward = reward;
        this.type = type; // 'deface', 'steal', 'wipe'
        this.difficulty = difficulty;
        this.completed = false;
    }
}

export class MissionSystem {
    constructor() {
        this.availableMissions = [];
        this.generateMissions();
    }

    generateMissions() {
        const nouns = ["Database", "Mainframe", "Server", "Archive", "Node", "Network", "Grid", "System", "Cloud", "Vault"];
        const corps = ["Omegasorp", "Cyberdyne", "Tyrell", "Arasaka", "E Corp", "Massive Dynamic", "Hooli", "Globex", "Umbrella", "Weyland-Yutani"];
        const actions = ["Infiltrate", "Hack", "Destroy", "Expose", "Decrypt", "Steal", "Corrupt", "Override", "Bypass", "Analyze"];
        const targets = ["Financial Records", "User Data", "Research Files", "Security Protocols", "Email Archives", "Prototype Blueprints", "Blackmail Material"];

        // Generate between 100 and 1000 missions randomly
        const missionCount = randomInt(100, 1000);

        for (let i = 0; i < missionCount; i++) {
            const corp = randomChoice(corps);
            const noun = randomChoice(nouns);
            const action = randomChoice(actions);
            const target = randomChoice(targets);

            const difficulty = randomInt(1, 10);
            // Reward scales with difficulty
            const baseReward = randomInt(100, 500);
            const reward = baseReward * difficulty;

            this.availableMissions.push(new Mission(
                i + 1, // distinct ID
                `${action} ${corp} ${noun}: ${target}`,
                reward,
                'steal', // Could randomize this too if Mission class supported more logic
                difficulty
            ));
        }

        // Shuffle missions so they aren't just ordered by creation (optional, but good for "random feel" if displayed in chunks)
        this.availableMissions.sort(() => Math.random() - 0.5);
    }
}
