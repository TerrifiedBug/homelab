# 🎬 Self-Hosted Media Stack with VPN, Jellyfin & *arr Suite

This repository contains a complete Docker Compose setup for a self-hosted, VPN-protected media server. It includes automated downloading, organization, and streaming of TV shows and movies — all accessible through a beautiful web UI.

---

## 🚀 Stack Overview

| Service        | Description |
|----------------|-------------|
| **Gluetun**    | VPN gateway (NordVPN) for secure and private torrenting, with enforced authentication and firewall-based leak protection. |
| **qBittorrent**| Torrent client routed through Gluetun. |
| **Sonarr**     | TV show management and automation. |
| **Radarr**     | Movie management and automation. |
| **Prowlarr**   | Indexer manager for Sonarr and Radarr. |
| **Jellyfin**   | Media server to stream downloaded content. |
| **Jellyseerr** | Jellyfin-compatible media request UI (alternative to Overseerr for Jellyfin). |
| **VPN Watchdog** | Monitors Gluetun's VPN status and stops/starts torrent-related containers if VPN disconnects or recovers. |

---

## 📦 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- A [NordVPN](https://nordvpn.com) account (OpenVPN credentials)
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

To protect Gluetun’s internal HTTP control API:

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
- Checks Gluetun’s VPN status every 30 seconds
- Stops containers (`qbittorrent`, `sonarr`, `radarr`, `prowlarr`) if the VPN disconnects
- Starts them again when the VPN reconnects

It uses `curl` with basic authentication and installs `curl` at runtime using:

```sh
apk add --no-cache curl
```

This ensures compatibility with the minimal Alpine base image.

---

## 🔎 Port Mappings

| Service     | URL                             |
|-------------|----------------------------------|
| qBittorrent | http://localhost:8063           |
| Sonarr      | http://localhost:8989           |
| Radarr      | http://localhost:7878           |
| Prowlarr    | http://localhost:9696           |
| Jellyfin    | http://localhost:8096           |
| Jellyseerr  | http://localhost:5056           |

> Note: qBittorrent, Sonarr, Radarr, and Prowlarr are routed through Gluetun for VPN protection and will not start unless the VPN is up and healthy.

---

## ✅ Features

- 🔐 Secure torrenting behind Gluetun (with NordVPN)
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
- [Jellyseerr](https://github.com/Fallenbagel/jellyseerr)

---

## ☕ Like this?

Give the repo a ⭐ or share it with fellow homelabbers!
