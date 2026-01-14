export const MAN_PAGES = {
    "scan": `
NAME
    scan - Network discovery tool

SYNOPSIS
    scan [OPTIONS]

DESCRIPTION
    Scans the local subnet for reachable hosts.
    
OPTIONS
    -v      Verbose mode (show OS fingerprints)
    -p      Port scan range
    -a      Aggressive scan
    
EXAMPLES
    scan
    scan -v
`,
    "connect": `
NAME
    connect - Establish remote connection

SYNOPSIS
    connect [IP]

DESCRIPTION
    Initiates a TCP handshake with target system.
    If vulnerability is found, grants shell access.
`,
    "hack": `
NAME
    hack - Automated exploitation tool

SYNOPSIS
    hack [TARGET]

DESCRIPTION
    Runs a suite of exploits against the target.
    Requires 'root' kit installed.
`,
    "voidscript": `
NAME
    voidscript - VoidScript Language Interpreter

SYNTAX
    print [TEXT]
    set [VAR] [VALUE]
    add [VAR] [VALUE]
    connect [IP]
    hack

EXAMPLE
    set target 192.168.1.1
    print Attacking 192.168.1.1
    connect 192.168.1.1
    hack
`
};
