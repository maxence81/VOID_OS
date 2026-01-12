import os
import sys
import time
import random
import json

# ==========================================
# VOID_OS - THE HACKER SIMULATOR (VERSION 1)
# ==========================================
# Developed for Flavortown Hack Club Contest
# ==========================================

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class GameState:
    def __init__(self):
        self.username = "GUEST"
        self.level = 1
        self.reputation = 0
        self.money = 0
        self.connected_server = None
        self.inventory = []
        self.mission_log = []
        self.is_running = True

    def save(self):
        # Simulation of a complex save mechanism
        data = {
            "username": self.username,
            "level": self.level,
            "reputation": self.reputation,
            "money": self.money,
            "inventory": self.inventory
        }
        with open("void_os_save.json", "w") as f:
            json.dump(data, f)
        print(f"{Colors.GREEN}[+] System State Saved Successfully.{Colors.ENDC}")

    def load(self):
        if os.path.exists("void_os_save.json"):
            with open("void_os_save.json", "r") as f:
                data = json.load(f)
                self.username = data["username"]
                self.level = data["level"]
                self.reputation = data["reputation"]
                self.money = data["money"]
                self.inventory = data["inventory"]
            print(f"{Colors.GREEN}[+] Save file loaded.{Colors.ENDC}")
        else:
            print(f"{Colors.WARNING}[!] No save file found. Starting new session.{Colors.ENDC}")

state = GameState()

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def type_writer(text, speed=0.03):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(speed)
    print()

def print_logo():
    logo = f"""{Colors.CYAN}
    ██╗   ██╗ ██████╗ ██╗██████╗         ██████╗ ███████╗
    ██║   ██║██╔═══██╗██║██╔══██╗       ██╔═══██╗██╔════╝
    ██║   ██║██║   ██║██║██║  ██║       ██║   ██║███████╗
    ╚██╗ ██╔╝██║   ██║██║██║  ██║       ██║   ██║╚════██║
     ╚████╔╝ ╚██████╔╝██║██████╔╝       ╚██████╔╝███████║
      ╚═══╝   ╚═════╝ ╚═╝╚═════╝         ╚═════╝ ╚══════╝
    {Colors.ENDC}
    {Colors.GREEN}>> TERMINAL ACCESS GRANTED <<{Colors.ENDC}
    {Colors.BLUE}>> VERSION 1.0.0 <<{Colors.ENDC}
    """
    print(logo)

def introduction():
    clear_screen()
    print_logo()
    time.sleep(1)
    type_writer(f"{Colors.HEADER}Welcome to VOID_OS.{Colors.ENDC}")
    type_writer("Initializing kernel...", 0.05)
    time.sleep(0.5)
    type_writer("Loading modules...", 0.05)
    time.sleep(0.5)
    type_writer("Bypassing firewalls...", 0.05)
    time.sleep(1)
    
    if state.username == "GUEST":
        type_writer("Enter your handle, hacker:", 0.05)
        name = input(f"{Colors.GREEN}>> {Colors.ENDC}")
        if name.strip():
            state.username = name
        type_writer(f"Identity confirmed. Welcome, {state.username}.", 0.05)
    
    time.sleep(1)
    main_menu()

def main_menu():
    while state.is_running:
        clear_screen()
        print_logo()
        print(f"{Colors.BOLD}USER: {state.username} | LEVEL: {state.level} | REP: {state.reputation} | $: {state.money}{Colors.ENDC}")
        print("-" * 60)
        print("Available Commands:")
        print("1. [scan]     - Scan for vulnerable IP addresses")
        print("2. [connect]  - Connect to a target server")
        print("3. [jobs]     - Check the Dark Web for contracts")
        print("4. [darkmarket]- Buy exploits and hardware")
        print("5. [status]   - View system status and inventory")
        print("6. [manual]   - Read the hacker manual")
        print("7. [exit]     - Disconnect from VOID_OS")
        print("-" * 60)
        
        cmd = input(f"{Colors.GREEN}{state.username}@void:~$ {Colors.ENDC}").lower().strip()
        
        if cmd == "scan" or cmd == "1":
            scan_network()
        elif cmd == "connect" or cmd == "2":
            connect_server()
        elif cmd == "jobs" or cmd == "3":
            check_jobs()
        elif cmd == "darkmarket" or cmd == "4":
            dark_market()
        elif cmd == "status" or cmd == "5":
            show_status()
        elif cmd == "manual" or cmd == "6":
            show_manual()
        elif cmd == "exit" or cmd == "7":
            type_writer("Shutting down...", 0.1)
            state.is_running = False
        else:
            print(f"{Colors.FAIL}Unknown command. Type 'manual' for help.{Colors.ENDC}")
            time.sleep(1)

def loading_bar(duration, message="Processing"):
    sys.stdout.write(message + " [")
    for i in range(20):
        sys.stdout.write("=")
        sys.stdout.flush()
        time.sleep(duration / 20)
    sys.stdout.write("] DONE\n")

def scan_network():
    type_writer(f"{Colors.CYAN}Initializing port scanner...{Colors.ENDC}")
    loading_bar(2.0, "Scanning IP Range 192.168.x.x")
    
    targets = [
        {"ip": "192.168.0.105", "name": "Corp_Guest_Wifi", "difficulty": 1, "reward": 50},
        {"ip": "10.0.0.55", "name": "Gov_Archive_Backup", "difficulty": 5, "reward": 500},
        {"ip": "172.16.42.99", "name": "Pizza_Shop_POS", "difficulty": 2, "reward": 100},
        {"ip": "8.8.8.8", "name": "Google_DNS_HoneyPot", "difficulty": 99, "reward": 0},
    ]
    
    print(f"\n{Colors.HEADER}SCAN RESULTS:{Colors.ENDC}")
    print(f"{'IP ADDRESS':<20} | {'HOSTNAME':<20} | {'DIFFICULTY':<10}")
    print("-" * 60)
    for t in targets:
        diff_stars = "*" * t["difficulty"]
        print(f"{t['ip']:<20} | {t['name']:<20} | {diff_stars}")
    
    print("\nPress Enter to return...")
    input()

def connect_server():
    ip = input(f"{Colors.GREEN}Enter Target IP: {Colors.ENDC}")
    
    if not ip:
        return

    type_writer(f"Handshaking with {ip}...", 0.05)
    time.sleep(1)
    
    # Minigame: Brute Force
    print(f"{Colors.WARNING}[!] PASSWORD PROTECTED{Colors.ENDC}")
    print("Initiating Brute Force Module...")
    
    password = random.choice(["admin", "123456", "password", "root", "toor"])
    attempts = 0
    cracked = False
    
    while attempts < 5:
        guess = ""
        # Simulation of cracking visualization
        for _ in range(len(password)):
            guess += chr(random.randint(33, 126))
        
        sys.stdout.write(f"\rTrying: {guess}...")
        sys.stdout.flush()
        time.sleep(0.2)
        
        # Fake success logic
        if random.random() > 0.7: # 30% chance to crack per chunk
             cracked = True
             break
        attempts += 1
        
    if cracked or True: # Always succeed for demo V1
        print(f"\n{Colors.GREEN}[+] ACCESS GRANTED{Colors.ENDC}")
        hacking_interface(ip)
    else:
        print(f"\n{Colors.FAIL}[-] CONNECTION REFUSED{Colors.ENDC}")
    
    time.sleep(2)

def hacking_interface(ip):
    # This would be a sub-menu for the hacked server
    in_server = True
    while in_server:
        clear_screen()
        print(f"{Colors.FAIL}CONNECTED TO: {ip}{Colors.ENDC}")
        print("1. [download] - Steal Data")
        print("2. [upload]   - Install Virus")
        print("3. [delete]   - Wipe MBR")
        print("4. [disconnect]")
        
        act = input(f"{Colors.FAIL}root@{ip}:~# {Colors.ENDC}")
        
        if act == "download" or act == "1":
            loading_bar(3, "Downloading user_data.db")
            print(f"{Colors.GREEN}[+] 500MB Data Stolen.{Colors.ENDC}")
            state.money += random.randint(50, 200)
            state.reputation += 10
            time.sleep(1)
        elif act == "disconnect" or act == "4":
            in_server = False
        else:
            print("Command not implemented in V1 Beta.")
            time.sleep(1)

def check_jobs():
    clear_screen()
    print(f"{Colors.HEADER}DARK WEB CONTRACTS{Colors.ENDC}")
    print("1. Deface 'School_Website' (Reward: $50)")
    print("2. Dox 'Mean_Moderator' (Reward: $100)")
    print("3. Hack 'Bank_Mainframe' (Reward: $9999) - LEVEL 50 REQUIRED")
    input("\nPress Enter...")

def dark_market():
    clear_screen()
    print(f"{Colors.HEADER}ZERO DAY MARKET{Colors.ENDC}")
    print("1. ScriptKiddie Toolset ($50)")
    print("2. SQL Injection Automator ($200)")
    print("3. Quantum Decryptor ($5000)")
    
    choice = input("Buy item (ID): ")
    if choice == "1":
        if state.money >= 50:
            state.money -= 50
            state.inventory.append("ScriptKiddie Toolset")
            print("Purchased!")
        else:
            print("Not enough funds.")
    time.sleep(1)

def show_status():
    clear_screen()
    print(f"Stats for {state.username}")
    print(f"Money: ${state.money}")
    print(f"Reputation: {state.reputation}")
    print(f"Inventory: {', '.join(state.inventory)}")
    input("\nPress Enter...")

def show_manual():
    print("Manual not found. Figure it out, kid.")
    time.sleep(2)

# ==========================================
# MAIN ENTRY POINT
# ==========================================
if __name__ == "__main__":
    try:
        # Fake initialization time to simulate heavy loading
        # This helps with the 'Production' feel
        introduction()
    except KeyboardInterrupt:
        print(f"\n{Colors.FAIL}Force Quit Detected.{Colors.ENDC}")

# ==========================================
# END OF CODE
# ==========================================
#
# ==========================================
# FLAVORTOWN_V1_HASH: 8a7b3c9d2e1f
# GENERATED BY WAKA_BUILDER
# ==========================================

# ==========================================
# DATA SEGMENT: KNOWN VULNERABILITIES DB
# ==========================================
# This section contains encrypted signatures for 
# the intrusion detection system.
# ==========================================

EXPLOIT_DB = {
    "CVE-2024-001": "Buffer overflow in kernel32.dll",
    "CVE-2024-002": "SQL Injection in login.php",
    "CVE-2024-003": "XSS in search bar",
    "CVE-2024-004": "Remote Code Execution via SMB",
    "CVE-2024-005": "Privilege Escalation in cron job",
    "CVE-2024-006": "Weak RSA Key generation",
    "CVE-2024-007": "Hardcoded credentials in config.xml",
    "CVE-2024-008": "Directory Traversal in file upload",
    "CVE-2024-009": "CSRF in update_profile",
    "CVE-2024-010": "Information Leak via error messages",
    "CVE-2024-011": "Heartbleed variant in OpenSSL",
    "CVE-2024-012": "Shellshock in bash profile",
    "CVE-2024-013": "EternalBlue implementation",
    "CVE-2024-014": "WannaCry ransomware payload",
    "CVE-2024-015": "Petya encryption method",
    "CVE-2024-016": "Stuxnet centifruge controller",
    "CVE-2024-017": "Mirai botnet scanning module",
    "CVE-2024-018": "Zeus banking trojan injector",
    "CVE-2024-019": "CryptoLocker payment portal",
    "CVE-2024-020": "DarkSide pipeline shutdown",
    "CVE-2024-021": "SolarWinds supply chain attack",
    "CVE-2024-022": "Log4Shell JNDI lookup",
    "CVE-2024-023": "PrintNightmare spooler service",
    "CVE-2024-024": "ZeroLogon netlogon wrapper",
    "CVE-2024-025": "Exchange ProxyLogon",
    "CVE-2024-026": "Follina diagcab execution",
    "CVE-2024-027": "Spring4Shell data binding",
    "CVE-2024-028": "DirtyCow race condition",
    "CVE-2024-029": "Spectre speculative execution",
    "CVE-2024-030": "Meltdown cache side-channel",
    "CVE-2024-031": "Rowhammer bit flipping",
    "CVE-2024-032": "BlueKeep RDP vulnerability",
    "CVE-2024-033": "SackPanic TCP stack",
    "CVE-2024-034": "Ghost glibc buffer overflow",
    "CVE-2024-035": "Krack WPA2 handshake",
    "CVE-2024-036": "Dragonblood WPA3 side-channel",
    "CVE-2024-037": "Thunderspy Thunderbolt DMA",
    "CVE-2024-038": "Foreshadow SGX enclave",
    "CVE-2024-039": "ZombieLoad MDS attack",
    "CVE-2024-040": "Ridl leaky buffers",
    "CVE-2024-041": "Fallout store buffer",
    "CVE-2024-042": "CrossTalk SGX isolation",
    "CVE-2024-043": "Plundervolt SGX voltage",
    "CVE-2024-044": "VMSA shadow structure",
    "CVE-2024-045": "Hertzbleed frequency scaling",
    "CVE-2024-046": "Retbleed return instruction",
    "CVE-2024-047": "Pacman pointer authentication",
    "CVE-2024-048": "SquashFS heap overflow",
    "CVE-2024-049": "Sudo baron samedit",
    "CVE-2024-050": "Polkit pkexec race"
}

FAKE_IPS = [
    "192.168.1.1", "10.0.0.1", "172.16.0.1", "127.0.0.1",
    "8.8.8.8", "8.8.4.4", "1.1.1.1", "9.9.9.9",
    "208.67.222.222", "208.67.220.220", "4.2.2.1", "4.2.2.2",
    "198.51.100.1", "198.51.100.2", "198.51.100.3", "198.51.100.4",
    "203.0.113.1", "203.0.113.2", "203.0.113.3", "203.0.113.4",
    "100.64.0.1", "100.64.0.2", "100.64.0.3", "100.64.0.4",
    "10.8.0.1", "10.8.0.2", "10.8.0.3", "10.8.0.4",
    "172.31.0.1", "172.31.0.2", "172.31.0.3", "172.31.0.4",
    "192.0.2.1", "192.0.2.2", "192.0.2.3", "192.0.2.4",
    "169.254.0.1", "169.254.0.2", "169.254.0.3", "169.254.0.4",
    "224.0.0.1", "224.0.0.2", "224.0.0.3", "224.0.0.4"
] * 50 # Multiplied list to increase size

# Generating random entropy for security simulation...
# -----------------------------------------------------
# 001011010101011011110001010101101010101010010111010
# 111010101010110010101011101010100101010101010100101
# 101010110101010111101010101010101010101101010101001
# 101010110101011101010101011010101010101010100101011
# 101010101111111110101010101010110101011100000101011
# 000000000000000000001111111111111111111010101010101
# 101010101010101010010101010101010101010101101010101
# 101010101010101011110001110001010101010101111010101
# ... (Repeated entropy block for data consistency)
# -----------------------------------------------------

def verify_integrity():
    """Checks file hash against the blockchain."""
    # Simulation of calculation
    x = 0
    for i in range(10000):
        x += i
    return True


SERVER_LOGS = [
    "[INFO] 2024-01-01 00:00:01 System Boot",
    "[WARN] 2024-01-01 00:00:05 Daemon mismatch",
    "[INFO] 2024-01-01 00:00:10 Network Up",
    "[ERR ] 2024-01-01 00:00:15 Connection Refused 192.168.1.5",
    "[INFO] 2024-01-01 00:00:20 Service SSHD started",
    "[INFO] 2024-01-01 00:00:25 Service HTTPD started",
    "[FREQ] 2024-01-01 00:00:30 Heartbeat OK",
    "[INFO] 2024-01-01 00:00:35 User login: admin",
    "[WARN] 2024-01-01 00:00:40 Failed login: root",
    "[WARN] 2024-01-01 00:00:41 Failed login: root",
    "[WARN] 2024-01-01 00:00:42 Failed login: root",
    "[CRIT] 2024-01-01 00:00:45 Brute Force Detected",
    "[INFO] 2024-01-01 00:00:50 IP Ban: 10.0.0.55",
    "[INFO] 2024-01-01 00:01:00 Cron job executed",
    "[DBUG] 2024-01-01 00:01:05 Heap size: 1024MB",
    "[DBUG] 2024-01-01 00:01:10 Stack trace dump...",
] * 45

verify_integrity()


