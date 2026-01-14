
export const USER_DB = [
    { id: 1001, user: "admin", pass: "password123", role: "sysadmin", hash: "5f4dcc3b5aa765d61d8327deb882cf99" },
    { id: 1002, user: "root", pass: "toor", role: "root", hash: "63a9f0ea7bb98050796b649e85481845" },
    { id: 1003, user: "guest", pass: "guest", role: "visitor", hash: "084e0343a0486ff05530df6c705c8bb4" },
    // ... (Imagine 1000s of lines here) ...
];

// Generative filling for volume
for (let i = 0; i < 5000; i++) {
    USER_DB.push({
        id: 2000 + i,
        user: `user_${i}`,
        pass: `pass_${Math.random().toString(36).substring(7)}`,
        role: "user",
        hash: Math.random().toString(16).substring(2)
    });
}

export const SERVER_LOGS = [
    "Jan 01 00:00:01 server sshd[1234]: Server listening on 0.0.0.0 port 22.",
    "Jan 01 00:00:02 server kernel: [    0.000000] Linux version 5.10.0-8-amd64 (debian-kernel@lists.debian.org)",
    "Jan 01 00:00:03 server systemd[1]: Detected architecture x86-64.",
    // ... (Verbose logs) ...
];

for (let i = 0; i < 2000; i++) {
    const ips = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    SERVER_LOGS.push(`Jan 01 00:${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')} server sshd[${2000 + i}]: Failed password for invalid user root from ${ips} port ${Math.floor(Math.random() * 65535)} ssh2`);
}

export const LORE_DOCUMENTS = {
    "manifesto.txt": `
        THE TECHNOLOGICAL REVOLUTION HAS DISASTERIOUS CONSEQUENCES
        ----------------------------------------------------------
        We are the ghosts in the machine.
        We are the watchers.
        
        (This document continues for pages...)
    `,
    "encrypted_plan.bin": "01010101010101010100101010101010101..."
};
