## 📦 Structure

Each folder in this repo represents a separate service or stack, typically containing:

- `docker-compose.yml`: The core Compose file defining the service(s)
- `stack.env`: A file containing environment variables used by the stack

All Compose files rely on `stack.env` for environment variables.
For Git-based stacks in Portainer, any additional secrets or environment variables defined manually in the GUI **must be referenced using `${VAR}` syntax** in the Compose file.

✅ All Compose files now properly reference their sensitive environment values as `${VARIABLE}`, ensuring compatibility with Portainer GUI-defined variables.

### Environment Variable Reference

For proper functionality with Portainer's UI:

1. Values in `stack.env` are used automatically when referenced in docker-compose.yml
2. For sensitive values marked as "redacted" in `stack.env`, the corresponding reference in docker-compose.yml should use `${VAR}` syntax
3. This allows substituting sensitive values via Portainer's UI without storing them in the Git repository

Example:
```yaml
services:
  example-service:
    image: example/image
    env_file:
      - stack.env
    environment:
      # For sensitive variables that are redacted in stack.env
      API_KEY: ${API_KEY}
      SECRET_TOKEN: ${SECRET_TOKEN}
```
