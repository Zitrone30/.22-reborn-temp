
---

# .22 Reborn — Anarchy Utility Bot for Minecraft

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Mineflayer](https://img.shields.io/badge/Mineflayer-Library-blue?logo=minecraft)](https://github.com/PrismarineJS/mineflayer)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](#license)

### Server Status (for play.6b6t.org - last 24h):

![Uptime](https://status.6b6t.org/api/v1/endpoints/minecraft_server-public/uptimes/24h/badge.svg)
![Response Time](https://status.6b6t.org/api/v1/endpoints/minecraft_server-public/response-times/24h/badge.svg)
![Health](https://status.6b6t.org/api/v1/endpoints/minecraft_server-public/health/badge.svg)

### Credits to ryk_cbaool for part of the code.

`.22` is a feature-rich Mineflayer bot designed for chaotic Minecraft servers like **6b6t.org**.
It offers server stats, utilities, fun commands, and admin tools — all while avoiding coordinate leaks.

---

## Quick Links

* [Features](#features)
* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Admin Tools](#admin-tools)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* Real-time server stats: TPS, player joins/quits, uptime, ping
* Utilities: polls, love meter, 8-ball, roll, flip
* Event tracking: chat cooldowns, kill/death stats
* Admin commands: whitelist management, remote execution
* Zero coordinate usage for safe base operation

---

## Installation

```bash
git clone https://github.com/Damix-hash/.22.git
cd .22
npm install
```

---

## Usage

1. Set environment variable/s:

```bash
export MC_PASSWORD="your_password"
export STORAGE_REPO_TOKEN="your_PAT_token"
export MAIN_REPO_PAT="your_PAT_token"
```
More about P.A.T (Personal Access Token) on github read [here.](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
You also need to initiate your own project path for archiving data, or just code your own

For STORAGE_REPO_TOKEN pick REPO only, for MAIN_REPO_PAT pick REPO and WORKFLOW

2. Create an private repo for your storage system.
   
3. Start the bot:

```bash
node index.js
```

4. The bot connects by default to `eu.6b6t.org` (changeable in `index.js`).

---

## Commands

### Public Commands

Prefix: `-`

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `help`        | Show paginated commands list        |
| `topkills`    | Display top kill counts             |
| `uptime`      | Show bot uptime                     |
| `deaths`      | Show death count                    |
| `health`      | Show bot health status              |
| `restart`  | Shows when server will restart in seconds                      |
| `love`        | Love compatibility meter            |
| `rate`        | Random rating of player/item        |
| `stfu`        | Send playful “shut up” message      |
| `screen`      | Capture bot’s screen (if supported) |
| `8ball`       | Magic 8-ball answers                |
| `roll`        | Roll a random number                |
| `flip`        | Coin flip                           |
| `choose`      | Pick randomly from choices          |
| `playerlist`  | List online players                 |
| `tps`         | Show server TPS                     |
| `kd`          | Kill/death ratio                    |
| `quote`       | Show random saved quote             |
| `paranoia`    | Paranoia rating                     |
| `stats`       | Show server/player stats            |
| `weather`     | Minecraft weather status            |
| `time`        | Minecraft world time                |
| `count`       | Counting game               |
| `ping`        | Show players ping                       |
| `playerjoins` | Show join count                     |
| `playerquits` | Show quit count                     |
| `avgping`     | Show average ping                   |
| `longestcd`   | Longest chat cooldown recorded      |
| `discord`     | Share Discord invite                |

### Admin Commands

> Whitelisted users only

| Command    | Description                          |
| ---------- | ------------------------------------ |
| `debug`    | Output various debug info            |
| `run`      | Execute a command remotely           |
| `say`      | Make bot say a message (non-command) |
| `welcomer` | Toggle join/quit greetings           |
| `tempwl`   | Temporarily whitelist a player       |
| `remwl`    | Remove a player from temp whitelist  |
| `timeout`  | DEBUGGING, Removes keep_alive packet, restarting the bot   |

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature-name`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) file.

---

### Star & Support

[![GitHub stars](https://img.shields.io/github/stars/Damix-hash/.22-reborn?style=social)](https://github.com/Damix-hash/.22-reborn/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Damix-hash/.22-reborn?style=social)](https://github.com/Damix-hash/.22-reborn/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Damix-hash/.22-reborn)](https://github.com/Damix-hash/.22-reborn/issues)
