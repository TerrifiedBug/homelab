# 🎬 Self-Hosted Media Stack with NordLynx VPN, Jellyfin & *arr Suite

This repository contains a complete Docker Compose setup for a self-hosted, VPN-protected media server. It includes automated downloading (via both Usenet and torrents), organization, and streaming of TV shows and movies — all accessible through a beautiful web UI.

---

## 🚀 Stack Overview

| Service        | Description |
|----------------|-------------|
| **Gluetun**    | VPN gateway using NordVPN's NordLynx (WireGuard) for secure, private, and faster downloading. |
| **qBittorrent**| Torrent client routed through Gluetun with health monitoring. |
| **SABnzbd**    | Usenet downloader routed through Gluetun for secure NZB downloads. |
| **Sonarr**     | TV show management and automation. |
| **Radarr**     | Movie management and automation. |
| **Prowlarr**   | Indexer manager for Sonarr and Radarr, supporting both torrent and Usenet indexers. |
| **Jellyfin**   | Media server to stream downloaded content. |
| **Jellyseerr** | Jellyfin-compatible media request UI. |

---

## 📦 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- A [NordVPN](https://nordvpn.com) account
- A Usenet provider account (such as Eweka or Newshosting)
- A Usenet indexer (such as NZBgeek)

---

## 🛠 Folder Structure

```
.
├── docker-compose.yml
├── stack.env                     # Your WireGuard private key
├── gluetun/
│   └── auth/
│       └── config.toml           # Gluetun control server authentication
├── qbittorrent/
├── sabnzbd/
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
WIREGUARD_PRIVATE_KEY=your_wireguard_private_key
```

---

## 🔑 Setting up NordVPN with NordLynx (WireGuard)

This stack uses NordVPN's WireGuard implementation (NordLynx) for faster speeds. To set it up:

1. **Get your WireGuard private key** from NordVPN:

   a. Go to https://my.nordaccount.com/dashboard/nordvpn/manual-configuration/ and create an access token

   b. Get your private key using curl and jq:
   ```bash
   curl -s -u token:<ACCESS_TOKEN> https://api.nordvpn.com/v1/users/services/credentials | jq -r .nordlynx_private_key
   ```

2. **Get server information** (optional, for reference):
   ```bash
   curl -s "https://api.nordvpn.com/v1/servers/recommendations?&filters\[servers_technologies\]\[identifier\]=wireguard_udp&limit=1" | jq -r '.[]|.hostname, .station, (.locations|.[]|.country|.city.name), (.locations|.[]|.country|.name), (.technologies|.[].metadata|.[].value), .load'
   ```

3. **Add your WireGuard private key** to your `stack.env`:
   ```env
   WIREGUARD_PRIVATE_KEY=your_wireguard_private_key_here
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

---

## 🧠 Smart Healthchecks

All VPN-dependent containers have built-in healthchecks that ping Google to verify internet connectivity through the VPN. This provides:

- Automatic health monitoring of each service
- Docker dashboard visibility of which services are healthy

If the VPN connection drops, the healthchecks will fail, showing you which services are affected.

---

## 📑 SABnzbd Configuration

When setting up SABnzbd for the first time:

1. Enter your Usenet provider details (server address, port, username, and password)
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

---

## ✅ Features

- 🔐 Secure downloading with NordLynx (WireGuard) for faster speeds
- 📥 Dual download sources: Usenet (SABnzbd) and BitTorrent (qBittorrent)
- 🩺 Health monitoring for all VPN-dependent services
- 📥 Automatic TV & movie downloads
- 🎞️ Streaming via Jellyfin
- 📤 Request management via Jellyseerr

---

## 💡 To Add

- **Bazarr**: Subtitle downloads
- **VPN auto-recovery alerts** via Telegram, Discord, or email
- **Container labeling** for dynamic service management

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
