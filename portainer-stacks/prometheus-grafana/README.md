# Prometheus-Grafana Monitoring Stack

This repository contains a Docker Compose setup for a complete monitoring solution using Prometheus and Grafana, with additional exporters for system and container metrics.

## Components

- **Prometheus**: Time series database and monitoring system
- **Grafana**: Visualization and dashboarding tool
- **Node Exporter**: Collects hardware and OS metrics from the host
- **cAdvisor**: Collects container metrics
- **CPU Temperature Exporter**: Custom exporter for CPU temperature metrics

## Directory Structure

```
prometheus-grafana/
├── cpu-temp-prometheus-exporter/  # Custom exporter for CPU temperature
│   └── main.js                    # Node.js script that exposes CPU temp metrics
├── prometheus/                    # Prometheus configuration
│   └── prometheus.yml            # Main Prometheus configuration file
└── docker-compose.yml            # Docker Compose configuration file
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

## Recommended Dashboards

Import these dashboards into Grafana for comprehensive monitoring:

- [Node Exporter Full](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
- [cAdvisor Exporter](https://grafana.com/grafana/dashboards/14282-cadvisor-exporter/)

## Dashboard Import Instructions

1. In Grafana, go to Dashboards > Import
2. Enter the dashboard ID (1860 for Node Exporter Full, 14282 for cAdvisor)
3. Select your Prometheus data source
4. Click Import

## Default Ports

- Prometheus: 9090
- Grafana: 3000
- Node Exporter: 9100
- cAdvisor: 8080
- CPU Temperature Exporter: 8084

## Notes

- Grafana's default login is admin/admin
- CPU temperature metrics will appear as `server_cpu_temp` in Prometheus
- Make sure the host running the CPU temperature exporter has the `sensors` command available
