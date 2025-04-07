# 🎬 Self-Hosted Media Stack with VPN, Jellyfin & *arr Suite

This repository contains a complete Docker Compose setup for a self-hosted, VPN-protected media server. It includes automated downloading (via both Usenet and torrents), organization, and streaming of TV shows and movies — all accessible through a beautiful web UI.

---

## 🚀 Stack Overview

| Service        | Description |
|----------------|-------------|
| **Gluetun**    | VPN gateway (NordVPN) for secure and private downloading, with enforced authentication and firewall-based leak protection. |
| **qBittorrent**| Torrent client routed through Gluetun. |
| **SABnzbd**    | Usenet downloader routed through Gluetun for secure and private NZB downloads. |
| **Sonarr**     | TV show management and automation. |
| **Radarr**     | Movie management and automation. |
| **Prowlarr**   | Indexer manager for Sonarr and Radarr, supporting both torrent and Usenet indexers. |
| **Jellyfin**   | Media server to stream downloaded content. |
| **Jellyseerr** | Jellyfin-compatible media request UI (alternative to Overseerr for Jellyfin). |
| **VPN Watchdog** | Monitors Gluetun's VPN status and stops/starts download-related containers if VPN disconnects or recovers. |

---

## 📦 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- A [NordVPN](https://nordvpn.com) account (OpenVPN credentials)
- A Usenet provider account (such as Eweka or Newshosting)
- A Usenet indexer (such as NZBgeek)
- Port forwarding not required (Gluetun handles it internally)

---

## 🛠 Folder Structure

```
.
├── docker-compose.yml
├── stack.env                     # Your credentials and config
├── gluetun/
│   └── auth/
│       └── config.toml           # Gluetun control server authentication config
├── qbittorrent/
├── sabnzbd/                      # SABnzbd configuration
├── sonarr/
├── radarr/
├── prowlarr/
├── jellyfin/
├── jellyseer/
└── media/
    ├── downloads/
    ├── movies/
    └── tv/
```

---

## 🔐 Environment Variables

Create a `stack.env` file in the root directory:

```env
NORDVPN_USER=your_nordvpn_username
NORDVPN_PASS=your_nordvpn_password
```

---

## 🔑 Gluetun Control Server Authentication

To protect Gluetun's internal HTTP control API:

1. Create a config file at `gluetun/auth/config.toml`:

```toml
[[roles]]
name = "healthcheck"
routes = ["GET /v1/openvpn/status"]
auth = "basic"
username = "healthcheck"
password = "secret"
```

2. Ensure the file is properly mounted in the Compose file:

```yaml
- ./gluetun/auth/config.toml:/gluetun/auth/config.toml:ro
```

3. Gluetun will enforce basic authentication for internal API access. Healthchecks and the VPN watchdog use these credentials to monitor VPN status.

---

## 🔄 VPN Watchdog

The `vpn-watchdog` service runs a loop that:
- Checks Gluetun's VPN status every 30 seconds
- Stops containers (`qbittorrent`, `sabnzbd`, `sonarr`, `radarr`, `prowlarr`) if the VPN disconnects
- Starts them again when the VPN reconnects

It uses `curl` with basic authentication and installs `curl` at runtime using:

```sh
apk add --no-cache curl
```

This ensures compatibility with the minimal Alpine base image.

---

## 📑 SABnzbd Configuration

When setting up SABnzbd for the first time:

1. You'll need to enter your Usenet provider details (server address, port, username, and password)
2. If accessing SABnzbd via a custom domain or IP address, add it to the host whitelist in SABnzbd's config.ini:
   ```
   host_whitelist = localhost,127.0.0.1,your-domain.com,192.168.1.0/24
   ```
3. For integration with Prowlarr, note your SABnzbd API key (found in Settings > General)

---

## 🔎 Port Mappings


| Service     | URL                             |
|-------------|----------------------------------|
| qBittorrent | http://localhost:8063           |
| SABnzbd     | http://localhost:8064           |
| Sonarr      | http://localhost:8989           |
| Radarr      | http://localhost:7878           |
| Prowlarr    | http://localhost:9696           |
| Jellyfin    | http://localhost:8096           |
| Jellyseerr  | http://localhost:5056           |

> Note: qBittorrent, SABnzbd, Sonarr, Radarr, and Prowlarr are routed through Gluetun for VPN protection and will not start unless the VPN is up and healthy.

---

## ✅ Features

- 🔐 Secure downloading behind Gluetun (with NordVPN)
- 📥 Dual download sources: Usenet (SABnzbd) and BitTorrent (qBittorrent)
- 🔄 Containers only start when VPN is healthy
- 📉 Containers automatically shut down if VPN disconnects (via VPN Watchdog)
- 🔁 Containers restart automatically when VPN returns
- 📥 Automatic TV & movie downloads
- 🎞️ Streaming via Jellyfin
- 📤 Request management via Jellyseerr

---

## 💡 To Add

- **Bazarr**: Subtitle downloads
- **VPN auto-recovery alerts** via Telegram, Discord, or email
- **Container labeling** for dynamic watchdog control

---

## 🧼 Credits

- [LinuxServer.io](https://www.linuxserver.io/)
- [Gluetun](https://github.com/qdm12/gluetun)
- [Jellyfin](https://jellyfin.org/)
- [Sonarr](https://sonarr.tv/)
- [Radarr](https://radarr.video/)
- [Prowlarr](https://github.com/Prowlarr/Prowlarr)
- [SABnzbd](https://sabnzbd.org/)
- [Jellyseerr](https://github.com/Fallenbagel/jellyseerr)

---

## ☕ Like this?

Give the repo a ⭐ or share it with fellow homelabbers!
