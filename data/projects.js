// Project list — edit this file to add / reorder / update projects.
window.PROJECTS = [
    {
        id: 'homelab',
        icon: '🏠',
        name: 'Homelab Infrastructure',
        featured: true,
        description: 'A 4-site homelab spanning 27+ VMs across 3 Proxmox hosts, with separate WAN links, Ansible automation, multi-chain crypto/system data analytics, and Proxmox Backup Server backed by S3.',
        tech: ['Proxmox', 'Ansible', 'Semaphore', 'Docker', 'PostgreSQL', 'Prometheus', 'Grafana', 'Tailscale', 'PBS + S3'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/homelab' }
        ],
        deepDive: {
            problem: 'Running infrastructure across multiple physical sites needs reliable automation, observability, and ACL-based access control — without commercial tooling cost.',
            architecture: [
                '3 Proxmox hosts hosting 27+ VMs split across <code>prod</code>, <code>lab</code>, and <code>dmz</code> tiers',
                '4 sites linked via Tailscale + dedicated WAN links for redundancy',
                'Ansible (with Semaphore as the UI/scheduler) drives configuration management and patching',
                'Multi-chain analytics: XRPL, Xahau, Ethereum, and Prometheus exporters writing to PostgreSQL',
                'Backups via Proxmox Backup Server with an S3 backend for offsite redundancy',
            ],
            highlights: [
                'One-click Ansible setup with secrets in Ansible Vault',
                'Hardened SSH, UFW, unattended-upgrades, and email alerting baked in as playbooks',
                'Custom Python scripts for Discord status webhooks and operational glue',
            ],
            takeaways: 'Treating the homelab as production-grade infra (CI for playbooks, code review, semantic versioning of changes) means changes are auditable, reproducible, and survive me forgetting what I did six months ago.',
        }
    },
    {
        id: 'gnome-tailscale',
        icon: '🛰️',
        name: 'gnome-tailscale',
        featured: true,
        description: 'A GNOME Shell extension that surfaces Tailscale operations into the panel — toggle the daemon, browse peers, copy IPs/hostnames, and pick exit nodes without leaving GNOME.',
        tech: ['JavaScript', 'GJS', 'GNOME Shell 48–50', 'Make', 'GitHub Actions'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/gnome-tailscale' }
        ],
        deepDive: {
            problem: 'The Tailscale CLI is excellent but lives in a terminal. GNOME\'s VPN panel doesn\'t speak the Tailscale control protocol, so day-to-day operations require shell commands.',
            architecture: [
                'Pure GJS ESM extension targeting GNOME Shell 48, 49, and 50',
                'Spawns <code>tailscale</code> subprocesses for status, peer enumeration, and exit-node selection',
                'Panel indicator with submenus for peers, exit nodes, and quick-jump URLs',
                'Makefile + CI workflow for packaging and lint',
            ],
            highlights: [
                'Read-only by default — never modifies daemon configuration unless explicitly asked',
                'Copy peer IPs/hostnames to clipboard with one click',
                'Tested across GJS ESM-era distros: Ubuntu 24.04+, Fedora 40+, Ubuntu 26.04',
            ],
            takeaways: 'Building an extension forced me to learn GJS\'s ESM module system and GNOME Shell\'s lifecycle hooks — surprisingly fun once the boilerplate is past.',
        }
    },
    {
        id: 'powerpilot',
        icon: '⚡',
        name: 'PowerPilot',
        description: 'A universal Linux power profile manager — system tray app with dual TLP/PPD backend support. Auto-detects which backend is installed and exposes profiles, battery thresholds, and per-device tuning.',
        tech: ['Python', 'GTK', 'TLP', 'power-profiles-daemon', 'systemd'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/powerpilot' }
        ],
        deepDive: {
            problem: 'Linux laptops have two competing power profile backends (TLP and power-profiles-daemon) with no shared user interface. Users either pick one and live in a terminal, or settle for a bare GNOME toggle.',
            architecture: [
                'Python tray app (GTK) that probes for TLP and PPD on startup',
                'Backend abstraction layer so the UI is identical regardless of which daemon is active',
                'systemd integration for autostart and privileged actions',
            ],
            takeaways: 'A small UX win — one icon in the tray, three profiles, one click — abstracted over messy backend reality.',
        }
    },
    {
        id: 'evernode-doctor',
        icon: '🩺',
        name: 'Evernode Node Doctor',
        featured: true,
        description: 'A comprehensive Bash health-check tool for Evernode/Xahau hosts. Validates system resources, Docker, networking, security posture, XRPL account balances, and Xahau node sync state.',
        tech: ['Bash', 'Docker', 'XRPL', 'Xahau', 'jq', 'curl'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/evernode-node-doctor' }
        ],
        deepDive: {
            problem: 'Running an Evernode host has dozens of preconditions across system, network, security, and on-chain state. Operators were learning failures the hard way — by losing tenants.',
            architecture: [
                'Single Bash script that runs ~40 checks and emits a colour-coded report',
                'Auto-detection of all configuration values for a fully non-interactive cron mode',
                'Strict Xahau <code>server_state: full</code> validation (won\'t accept partial sync)',
                'Evernode log analysis with intelligent error/warning classification',
            ],
            highlights: [
                'Cron mode for unattended monitoring',
                'Port usage analysis: detects ports open in firewall but not actually listening',
                '<code>--skip-logs</code> for fast runs, full mode for incident triage',
            ],
            takeaways: 'Bash is the right tool for a node-level health check — no runtime to install, runs anywhere SSH does, and the operator can read every line of it.',
        }
    },
    {
        id: 'jeeves',
        icon: '🎵',
        name: 'Jeeves — Discord Music Bot',
        description: 'A modernised fork of MusicBot with 48 slash commands, Spotify radio, support for YouTube/SoundCloud/Bandcamp, Docker deployment, systemd hardening, and a 70-test test suite (3,640 lines / 21 commits).',
        tech: ['Python', 'discord.py', 'yt-dlp', 'Spotify API', 'Docker', 'systemd', 'pytest'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/MusicBot' }
        ],
        deepDive: {
            problem: 'The upstream MusicBot was prefix-command-only and had drifted from current Discord/YouTube APIs. yt-dlp compatibility was breaking for newer formats.',
            architecture: [
                'Migrated all 48 commands from prefix-style to discord.py slash commands',
                'Added Spotify radio mode (uses Spotify recommendations to seed an endless queue)',
                'Container image with non-root user and systemd hardening flags for bare-metal deploys',
                'pytest suite with 70 tests covering parsing, queue management, and command dispatch',
            ],
            highlights: [
                '48 slash commands — same surface area as the original prefix bot',
                'Adjustable playback speed (0.5x – 100x) and seek',
                'Maintained yt-dlp compatibility across breaking format changes',
            ],
        }
    },
    {
        id: 'discord-auto-updater',
        icon: '🔄',
        name: 'Discord Auto-Updater',
        description: 'A wrapper script that intercepts Discord\'s launch on Linux, checks for updates, downloads the latest .deb, validates it, and silently installs via a passwordless sudoers rule — so users never see the manual download dialog.',
        tech: ['Bash', 'dpkg', 'apt', 'sudoers', 'flock'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/discord-auto-updater' }
        ],
        deepDive: {
            problem: 'Discord on Linux refuses to auto-update. Every release triggers a "go download a .deb" dialog. Tedious, error-prone, and you end up out of date.',
            architecture: [
                'Desktop file shim that points to the wrapper instead of <code>/usr/bin/discord</code>',
                'Wrapper queries <code>dpkg -s discord</code> and Discord\'s download API to compare versions',
                'Downloads to <code>/tmp</code>, validates the .deb, and installs via <code>apt</code> with a scoped sudoers rule',
                '<code>flock</code> prevents races from double-clicks',
                'Network timeouts so Discord still launches when offline',
            ],
            takeaways: 'Three small Bash functions saved hundreds of clicks per year. Sometimes the right answer is a 100-line shell script.',
        }
    },
    {
        id: 'esp32-reed',
        icon: '📡',
        name: 'ESP32 Reed Sensor Email Notifier',
        description: 'An ESP32-based door/window sensor that monitors a magnetic reed switch and sends instant email alerts on state change. Two SMTP backends (Gmail App Password & Brevo) and multi-network Wi-Fi failover.',
        tech: ['C++', 'ESP32', 'Arduino', 'SMTP/SSL', 'STARTTLS'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/ESP32-Reed-Sensor-Email-Notifier' }
        ],
        deepDive: {
            problem: 'I wanted instant email alerts when a door or window opens, without paying a SaaS for a $3 sensor.',
            architecture: [
                'ESP32 monitors a reed switch on a GPIO with software debouncing',
                'On state change, connects to the strongest known Wi-Fi network and sends SMTP',
                'Two sketches: Gmail (SSL on 465) and Brevo (STARTTLS on 587)',
                'Built-in LED reflects sensor state and blinks to confirm an email send',
            ],
        }
    },
    {
        id: 'blog',
        icon: '📝',
        name: 'Tech Blog — Building, Breaking & Automating Things',
        description: 'A Jekyll/Chirpy tech blog with a custom Matrix-inspired theme. 30+ articles covering homelabs, DevOps, cloud computing, networking, security, and IoT.',
        tech: ['Jekyll', 'Chirpy', 'GitHub Pages', 'Liquid', 'SCSS'],
        links: [
            { label: 'GitHub', url: 'https://github.com/Joshwaamein/Joshwaamein.github.io' },
            { label: 'Live site', url: 'https://joshwaamein.github.io' }
        ],
        deepDive: {
            problem: 'I needed a place to write up the things I build and break, without yet another SaaS account.',
            architecture: [
                'Jekyll + Chirpy theme on GitHub Pages',
                'All custom styling lives in <code>_includes/metadata-hook.html</code>, Chirpy\'s injection point',
                'Matrix-green colour scheme: <code>#00ff41</code> for accents, <code>#008f11</code> for sidebar nav',
                'Custom sidebar treatment with glow effects on hover',
            ],
            highlights: [
                '30+ published articles',
                'Zero-cost hosting on GitHub Pages',
                'The portfolio site you\'re reading shares its design language with the blog',
            ],
        }
    },
    {
        id: 'llmfit',
        icon: '🦾',
        name: 'llmfit (contributor)',
        description: 'A Rust terminal tool that right-sizes LLM models to your hardware. Detects RAM/CPU/GPU, scores models on quality/speed/fit/context, and tells you which models will actually run well on your machine.',
        tech: ['Rust', 'TUI', 'Ollama', 'llama.cpp', 'MLX'],
        links: [
            { label: 'GitHub', url: 'https://github.com/AlexsJones/llmfit' },
            { label: 'My fork', url: 'https://github.com/Joshwaamein/llmfit' }
        ],
        deepDive: {
            problem: 'Picking a local LLM is hard — quants, MoE architectures, GPU memory math, and runtime support combine into a maze.',
            architecture: [
                'Hardware detection across multi-GPU setups',
                'Scoring engine across quality / speed / fit / context dimensions',
                'Interactive TUI plus a classic CLI mode',
                'Adapters for Ollama, llama.cpp, and MLX local runtime providers',
            ],
            takeaways: 'Contributing to a Rust project written by someone else was a great way to learn idioms beyond the toy "ownership tutorial" stage.',
        }
    },
];
