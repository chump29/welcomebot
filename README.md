# ![WelcomeBot](./utils/images/welcomebot.webp) WelcomeBot

> - WelcomeBot for Discord

---

![Bun](https://img.shields.io/badge/Bun-1.4.2-informational?style=plastic&logo=bun) &nbsp;
![discord.js](https://img.shields.io/badge/discord.js-^14.27.0-informational?style=plastic&logo=discord.js)

![CodeQL](https://github.com/chump29/welcomebot/workflows/CodeQL/badge.svg) &nbsp;
![Coverage](https://img.shields.io/badge/Coverage-83.17%25-success?style=plastic&logo=jest)

![NO AI](https://img.shields.io/badge/NO-AI-orange?style=plastic "NO AI") &nbsp;
![License](https://img.shields.io/github/license/chump29/welcomebot?style=plastic&color=blueviolet&label=License&logo=gplv3) &nbsp; <!-- markdownlint-disable MD013 -->
![CVE Scan](https://img.shields.io/badge/CVE%20Scan-Pass-success?style=plastic&logo=owasp "CVE Scan")

---

### What it does: <!-- markdownlint-disable-line MD001 -->

- Welcomes new member to server

---

### 🔗 Invite Link <!-- markdownlint-disable-line MD001 -->

[Add WelcomeBot](https://discord.com/oauth2/authorize?client_id=1491949693910122546&permissions=19456&integration_type=0&scope=bot)

---

### 🖥️ Discord <!-- markdownlint-disable-line MD001 -->

#### Role Permissions:

| ⚙️ Permission |
|:-------------:|
|  ViewChannel  |
| SendMessages  |
|  EmbedLinks   |

#### Commands:

|   📋 Task    |    🔧 Command     | ⚙️ Permission |
|:------------:|:-----------------:|:-------------:|
|     Info     |      `/info`      |     None      |
|     Ping     |      `/ping`      |     None      |
| Send Welcome | `/welcome [user]` | Administrator |

---

### 🖧 Docker

#### Environment Variables:

|     📝 Description      | 📌 Variable |  {...} Value   |
|:-----------------------:|:-----------:|:--------------:|
|        Activity         |  ACTIVITY   |   Welcoming    |
|       Channel ID        | CHANNEL_ID  |     \<id>      |
| Embed Color<sup>1</sup> |    COLOR    |    #78866b     |
|          Debug          |    DEBUG    | true/**false** |
|        Bot Name         |    NAME     |   WelcomeBot   |
|        Bot Token        |    TOKEN    |    \<token>    |

###### <sup>1</sup> #RRGGBB format <!-- markdownlint-disable-line MD001 -->

##### From `@postfmly/logoserver`:

|  📝 Description   | 📌 Variable |    {...} Value    |
|:-----------------:|:-----------:|:-----------------:|
|     Logo Name     |  LOGO_NAME  |  welcomebot.webp  |
|  Logo Local Path  |  LOGO_PATH  |  ./utils/images   |
|       Port        |  LOGO_PORT  | **Random**/[port] |
|     Logo URL      |  LOGO_URL   |      \<url>       |
|    Logo 2 Name    | LOGO2_NAME  |   welcome.webp    |
| Logo 2 Local Path | LOGO2_PATH  |  ./utils/images   |
|    Logo 2 URL     |  LOGO2_URL  |      \<url>       |

##### From `@postfmly/checkrate`:

###### *NOTE: Rate limited to 1 request per 1 second*

#### Deployment:

|  📜 Script  |  🔧 Command   |
|:-----------:|:-------------:|
|    Full     | `./build.sh`  |
| Docker Only | `./docker.sh` |

---

### 📄 Documentation

### Generate:

```bash
./docs.sh
```

---

### 🛰️ Git & CI/CD

- **Pre-Commit:** Staged files are automatically linted
- **Github Actions:** Builds and pushes images to repository
  - latest
    - amd64
    - arm64
