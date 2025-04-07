ingress:
  - hostname: your-domain.com
    service: https://app:443
    originRequest:
      originServerName: your-domain.com
      noTLSVerify: true
