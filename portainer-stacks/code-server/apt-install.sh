#!/usr/bin/env bash
echo "[custom-init] Installing apt packages..."
apt update
apt install -y python3 python3-pip python3-venv shellcheck docker.io docker-compose
