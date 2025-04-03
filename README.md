## 📦 Structure

Each folder in this repo represents a separate service or stack, typically containing:

- `docker-compose.yml`: The core Compose file defining the service(s)
- `stack.env`: A file containing environment variables used by the stack

All Compose files rely on `stack.env` for environment variables.
However, for Git-based stacks in Portainer, any additional secrets or environment variables defined manually in the GUI **must be referenced using `${VAR}` syntax** in the Compose file.

🚧 At present, many Compose files do **not yet reference their environment values as `${VARIABLE}`**, which breaks compatibility with Portainer GUI-defined variables.
I'm working on updating all Compose files to follow this convention consistently.
