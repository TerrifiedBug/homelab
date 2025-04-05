# Calibre Web Automated - Homelab Setup

This directory contains the configuration for Calibre Web Automated (CWA), a Docker-based e-book management system with automation features.

## Quick Start

```bash
# Clone the repository (if using git)
git clone https://github.com/crocodilestick/Calibre-Web-Automated.git
cd calibre-web-automated

# Start the container
docker-compose up -d
```

The web interface will be available at http://localhost:8060

## Directory Structure

- `./config` - Configuration files for Calibre Web
- `./cwa-book-ingest` - Drop folder for automatic book importing (files will be removed after processing)
- `./calibre-library` - Your main Calibre library storage

## Configuration

Default configuration values in the `docker-compose.yml`:

- User/Group: PUID=1000, PGID=1000
- Timezone: Europe/London
- Port: 8060 (maps to internal port 8083)

## Kobo Sync Setup

To enable syncing with Kobo e-readers:

1. In CWA Admin settings, enable `Kobo sync`
2. Set `Server External Port` to 80
3. Go to your profile page, enable `Kobo sync` and copy the API endpoint
4. **Important**: Update the API endpoint to use `https://` instead of `http://`
5. Plug in your Kobo device and paste in the API endpoint URL

## Nginx Proxy Manager Configuration

When using Nginx Proxy Manager with HTTPS:

1. Set up a proxy host for your Calibre Web Automated instance
2. Enable SSL with Let's Encrypt
3. Add the following to the "Advanced Configuration":

```
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
proxy_set_header X-Scheme $scheme;
```

## Troubleshooting

- If you're migrating from an existing Calibre Web installation, stop the existing instance, copy the config folder, and bind it to the `./config` directory to preserve your settings.
- Make sure the file permissions are correct on your mapped volumes.
- Check container logs if you encounter issues: `docker logs calibre-web-automated`

## Resources

- [Calibre Web Automated GitHub Repository](https://github.com/crocodilestick/Calibre-Web-Automated)
- [Kobo Sync Documentation](https://github.com/lksrpp/synology-calibre-web-kobo-sync)
