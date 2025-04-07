# Nginx Proxy Manager with Cloudflared

This repository contains a Docker Compose setup for running Nginx Proxy Manager alongside Cloudflare Tunnel (cloudflared) to securely expose web services without opening ports on your firewall.

## Overview

This configuration creates a secure gateway for your web applications by combining:
- **Nginx Proxy Manager (NPM)**: For easy management of proxy hosts, SSL certificates, and redirections
- **Cloudflared**: For creating a secure tunnel from Cloudflare to your local services

## Prerequisites

- Docker and Docker Compose installed
- A Cloudflare account with a domain
- DNS for your domain managed by Cloudflare

## Directory Structure

```
.
├── docker-compose.yml
├── data/                 # NPM data directory
├── letsencrypt/          # SSL certificates
└── cloudflared/          # Cloudflared configuration
    ├── cert.pem          # Cloudflare certificate
    ├── config.yml        # Tunnel configuration
    └── credentials file  # Tunnel credentials
```

## Setup Instructions

### 1. Clone this repository

```bash
git clone https://github.com/yourusername/nginx-proxy-manager-cloudflared.git
cd nginx-proxy-manager-cloudflared
```

### 2. Set up Cloudflared Authentication

```bash
# Create directory for cloudflared
mkdir -p cloudflared

# Authenticate with Cloudflare
docker run --rm -it -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest login
```

Follow the URL provided and authenticate in your browser.

### 3. Create a Cloudflare Tunnel

```bash
docker run --rm -v $(pwd)/cloudflared:/etc/cloudflared cloudflare/cloudflared:latest --origincert /etc/cloudflared/cert.pem tunnel create npm-tunnel
```

This will create a tunnel and generate a credentials file in your cloudflared directory.

### 4. Configure the Cloudflare Tunnel

Create a `config.yml` file in your cloudflared directory:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /etc/cloudflared/YOUR_CREDENTIALS_FILE.json
ingress:
  - hostname: yourdomain.com
    service: https://app:443
    originRequest:
      originServerName: yourdomain.com
      noTLSVerify: true
  - service: http_status:404
```

Replace:
- `YOUR_TUNNEL_ID` with the tunnel ID from step 3
- `YOUR_CREDENTIALS_FILE.json` with the name of the JSON file generated in step 3
- `yourdomain.com` with your actual domain name

### 5. Create DNS Records

```bash
docker run --rm -v $(pwd)/cloudflared:/etc/cloudflared cloudflare/cloudflared:latest --origincert /etc/cloudflared/cert.pem tunnel route dns YOUR_TUNNEL_ID yourdomain.com
```

### 6. Start the Docker Compose Stack

```bash
docker-compose up -d
```

### 7. Configure Nginx Proxy Manager

1. Access the NPM admin interface at `http://your-server-ip:81`
2. Default credentials:
   - Email: `admin@example.com`
   - Password: `changeme`
3. Create proxy hosts for your domains that point to your internal services

## Important Configuration Notes

- The `originServerName` parameter is crucial for proper SSL negotiation between cloudflared and NPM
- The `noTLSVerify: true` setting bypasses SSL verification between cloudflared and NPM
- To add multiple domains, add more hostname entries in the ingress configuration

## Troubleshooting

### TLS Connection Issues

If you see errors like "unrecognized name" in cloudflared logs:
- Ensure that `originServerName` matches exactly the domain configured in NPM
- Verify that SSL is properly set up in NPM for the domain

### DNS Issues

- Check if the DNS record in Cloudflare points to your tunnel's domain
- Ensure Cloudflare proxying is enabled (orange cloud)

### Container Connection Issues

- Both containers need to be on the same Docker network
- The service name in the cloudflared config should match the container name in Docker Compose

## Security Considerations

- All traffic between clients and Cloudflare is encrypted
- The connection between cloudflared and NPM is encrypted but certificate validation is bypassed
- Access lists in NPM will see traffic as coming from the cloudflared container's IP, not the original client IP

## Maintenance

- Keep both NPM and cloudflared images updated regularly
- Check Cloudflare's documentation for any changes to tunnel configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
