# 🎬 Self-Hosted Media Stack with VPN, Jellyfin & *arr Suite

This repository contains a complete Docker Compose setup for a self-hosted, VPN-protected media server. It includes automated downloading, organization, and streaming of TV shows and movies — all accessible through a beautiful web UI.

---

## 🚀 Stack Overview

| Service      | Description |
|--------------|-------------|
| **Gluetun**  | VPN gateway (NordVPN) for secure and private torrenting. |
| **qBittorrent** | Torrent client routed through Gluetun. |
| **Sonarr**   | TV show management and automation. |
| **Radarr**   | Movie management and automation. |
| **Prowlarr** | Indexer manager for Sonarr and Radarr. |
| **Overseerr**| Web UI for users to request movies/TV shows. |
| **Jellyfin** | Media server to stream downloaded content. |
| **Jellyseerr** | Jellyfin-compatible media request UI (alternative to Overseerr). |

---

## 📦 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- A [NordVPN](https://nordvpn.com) account (OpenVPN credentials)
- Port forwarding not required (Gluetun handles it)

---

## 🛠 Folder Structure

```
.
├── docker-compose.yml
├── stack.env                     # Your credentials and config
├── gluetun/
├── qbittorrent/
├── sonarr/
├── radarr/
├── prowlarr/
├── overseerr/
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

4. Port Mappings:

| Service     | URL                             |
|-------------|----------------------------------|
| qBittorrent | http://localhost:8063           |
| Sonarr      | http://localhost:8989           |
| Radarr      | http://localhost:7878           |
| Prowlarr    | http://localhost:9696           |
| Overseerr   | http://localhost:5055           |
| Jellyfin    | http://localhost:8096           |
| Jellyseerr  | http://localhost:5056           |

> Note: Sonarr, Radarr, Prowlarr, and qBittorrent are routed through Gluetun for VPN protection.

---

## ✅ Features

- 🔐 Secure torrenting behind Gluetun (with NordVPN)
- 📥 Automatic TV & movie downloads
- 🎞️ Streaming via Jellyfin
- 📤 Request management via Overseerr/Jellyseerr
- 🔄 Full automation from search to stream

---

## 💡 To Add

- **Bazarr**: Subtitle downloads

---

## 🧼 Credits

- [LinuxServer.io](https://www.linuxserver.io/)
- [Gluetun](https://github.com/qdm12/gluetun)
- [Jellyfin](https://jellyfin.org/)
- [Sonarr](https://sonarr.tv/)
- [Radarr](https://radarr.video/)
- [Prowlarr](https://github.com/Prowlarr/Prowlarr)
- [Overseerr](https://overseerr.dev/)
- [Jellyseerr](https://github.com/Fallenbagel/jellyseerr)

---

## ☕ Like this?

Give the repo a ⭐ or share it with fellow homelabbers!
