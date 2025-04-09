# Setting up Caddy with Cloudflared Tunnel

This guide explains how to set up a Caddy server with Cloudflared for secure access to your applications through Cloudflare Tunnels.

## Prerequisites

- A Cloudflare account with a domain
- Docker and Docker Compose installed
- Cloudflare API token with the right permissions

## Setup Instructions

### 1. Create Directory Structure and Fix Permissions

```bash
# Create directories
mkdir -p cloudflared
touch cloudflared/config.yml

# Fix permissions - CRITICAL STEP!
sudo chown -R 65532:65532 cloudflared
```

### 2. Authenticate with Cloudflare

Run the following command to authenticate with Cloudflare:

```bash
docker run --rm -it -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest login
```

This will open a URL in your browser. Login with your Cloudflare account and authorize the certificate. The certificate will be saved to `cloudflared/cert.pem`.

### 3. Create a Cloudflare Tunnel

After authentication, create a new tunnel:

```bash
docker run --rm -it -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest tunnel create caddy-tunnel
```

This will create a tunnel named "caddy-tunnel" and generate a credentials file in the `cloudflared` directory.

### 4. Configure Cloudflared

Now list your tunnels to get the Tunnel ID:

```bash
docker run --rm -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest tunnel list
```

You'll see output like this:
```
ID                                   NAME           CREATED              DELETED CONNECTION
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx caddy-tunnel   2025-04-09 10:00:00 false   1
```

Edit the `cloudflared/config.yml` file with the tunnel ID and your domain:

```yaml
tunnel: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
credentials-file: /home/nonroot/.cloudflared/credentials/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json

# Set your tunnel name (for reference only)
tunnel-name: caddy-tunnel

ingress:
  # Route traffic to your Caddy server
  - hostname: '*.YOUR_DOMAIN.com'
    service: http://caddy:80
  - hostname: YOUR_DOMAIN.com
    service: http://caddy:80
  # Default catch-all rule
  - service: http_status:404
```

Remember to replace:
- `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your actual tunnel ID
- `YOUR_DOMAIN.com` with your actual domain name

### 5. Route Your Domain to the Tunnel

Run the following commands to route your domain to the tunnel:

```bash
# Route your main domain to the tunnel
docker run --rm -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest tunnel route dns caddy-tunnel YOUR_DOMAIN.com

# Route wildcard subdomains to the tunnel
docker run --rm -v $(pwd)/cloudflared:/home/nonroot/.cloudflared cloudflare/cloudflared:latest tunnel route dns caddy-tunnel "*.YOUR_DOMAIN.com"
```

Replace `YOUR_DOMAIN.com` with your actual domain name.

### 6. Create Environment Variables File

Create a `.env` file with the necessary environment variables:

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
DOMAIN=YOUR_DOMAIN.com
```

### 7. Start the Stack

```bash
docker-compose up -d
```

You can check the logs to make sure everything is working:

```bash
docker-compose logs -f cloudflared
```

## Validation

After completing the setup, your applications should be accessible through your domain using the Cloudflare Tunnel. This provides secure, encrypted access to your services without exposing any ports to the internet.

## Troubleshooting

### Check Cloudflared Logs

```bash
docker logs cloudflared
```

### Check Caddy Logs

```bash
docker logs caddy
```

### Verify Tunnel Status

Check the status of your tunnel in the Cloudflare Zero Trust dashboard under Access > Tunnels.
