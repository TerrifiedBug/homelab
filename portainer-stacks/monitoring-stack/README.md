# Prometheus-Grafana Monitoring Stack

This repository contains a Docker Compose setup for a complete monitoring solution using Prometheus and Grafana, with additional exporters for system and container metrics, and **Loki/Promtail for log aggregation and analysis**.

## Components

- **Prometheus**: Time series database and monitoring system
- **Grafana**: Visualization and dashboarding tool
- **Loki**: Log aggregation system that integrates with Grafana
- **Promtail**: Log shipper for Loki (collects system and container logs)
- **Node Exporter**: Collects hardware and OS metrics from the host
- **cAdvisor**: Collects container metrics
- **CPU Temperature Exporter**: Custom exporter for CPU temperature metrics

## Directory Structure

```
prometheus-grafana/
├── cpu-temp-prometheus-exporter/  # Custom exporter for CPU temperature
│   └── main.js                    # Node.js script that exposes CPU temp metrics
├── prometheus/                    # Prometheus configuration
│   └── prometheus.yml             # Main Prometheus configuration file
├── promtail/                      # Promtail configuration
│   └── config.yml                 # Main Promtail configuration file
├── grafana/                       # Promtail configuration
│   └── provisioning               # Main Promtail configuration file
│      └── datasources
│        └── loki.yml              # Provision Loki datasource on Grafana
└── docker-compose.yml             # Docker Compose configuration file
```

## Setup Instructions

1. Clone this repository
2. (Optional) Modify `prometheus/prometheus.yml` to adjust scrape targets
3. Update the CPU temperature exporter target IP in `prometheus.yml` if needed
4. Deploy the stack:
   ```
   docker-compose up -d
   ```

## CPU Temperature Exporter

The CPU temperature exporter is a simple Node.js script that exposes the highest CPU core temperature. This script should be run directly on the host machine (not in a container) using:

```
/usr/bin/js cpu-temp-prometheus-exporter/main.js
```

It exposes metrics on port 8084, which Prometheus is configured to scrape.

## Log Aggregation with Loki & Promtail

Promtail is configured to:
- Collect logs from `/var/log/syslog`
- Collect container logs from `/var/lib/docker/containers`
- Send them to the Loki service

Loki is exposed on port **3100** and integrates with Grafana for log visualization.

## Recommended Dashboards

Import these dashboards into Grafana for comprehensive monitoring:

- [Node Exporter Full](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
- [cAdvisor Exporter](https://grafana.com/grafana/dashboards/14282-cadvisor-exporter/)
- **System & Docker Logs** (included logs-dashboard.json JSON file in this repo)

## Dashboard Import Instructions

1. In Grafana, go to Dashboards > Import
2. Enter the dashboard ID (1860 for Node Exporter Full, 14282 for cAdvisor)
3. Upload the included JSON dashboard for logs
4. Select your Prometheus or Loki data source
5. Click Import

## Default Ports

- Prometheus: 9090
- Grafana: 3000
- Loki: 3100
- Node Exporter: 9100
- cAdvisor: 8080
- CPU Temperature Exporter: 8084

## Notes

- Grafana's default login is admin/admin
- CPU temperature metrics will appear as `server_cpu_temp` in Prometheus
- Make sure the host running the CPU temperature exporter has the `sensors` command available
