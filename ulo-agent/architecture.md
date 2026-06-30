# a) Purpose: Defines the architecture of the system-wide Ulo Agent.
# c) Install/Test: Design document for `ulo-agentd`
# d) Open decisions: Local model choice. We recommend Ollama with Llama 3 8B.

# Ulo Agent Architecture

The Ulo Agent ("thinks like an agent") provides natural language automation, file operations, and code assistance built directly into the OS.

## 1. Components
- **`ulo-agentd`**: The background daemon. It orchestrates user requests and interfaces with the LLM backend.
- **LLM Engine**: `ollama` running locally to ensure privacy. (Default Model: `phi-3` or `llama3-8b` depending on system RAM).
- **API Connector**: Pluggable backend for users who provide an OpenAI/Anthropic/Gemini API key for more complex tasks.
- **DBus Interface**: Exposes agent capabilities to UloShell (search bar), Ulo Terminal, and Ulo Code.

## 2. Capabilities & Tools
The agent has strict scopes. It uses "Tool Calling" to interact with the OS:
- **`os_control`**: Adjust volume, brightness, power profiles (`powerprofilesctl`).
- **`app_management`**: Interact with `ulo-pkgd` to install/remove packages based on queries like "install a code editor".
- **`file_ops`**: Uses `fd` and `ripgrep` for semantic search and batch file renaming.
- **`terminal_copilot`**: Analyzes shell errors (hooked into fish/zsh) and provides explanations inline.

## 3. Permission Model & Auditing
- **Zero-Trust for Destructive Actions:** If the agent tries to run `rm -rf`, `pacman -R`, or modify system files, `ulo-agentd` sends a Polkit-style GUI prompt to the user via UloShell.
- **Audit Log**: Every tool call is logged in `~/.local/state/ulo-agent/audit.json`.
- **Revoke/Undo**: The shell has a dedicated "Agent History" panel allowing the user to view recent actions and click "Undo" (which triggers BTRFS snapshot rollbacks if system changes were made).

## 4. UI Integration
- **Global Hotkey (Super + A)**: Drops down a command bar (similar to Raycast/Spotlight) but focused on agentic commands ("free up 5GB on my disk").
- **Agent Status Indicator**: The UloShell quick settings panel shows if the local model is currently loaded in RAM or idle.
