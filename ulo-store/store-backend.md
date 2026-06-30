# a) Purpose: Specifications for the Ulo Store backend architecture.
# c) Install/Test: This is a design document describing the implementation logic for `ulo-pkgd`.
# d) Open decisions: Should AUR packages have a warning flag in the UI? (Defaulting to yes).

# Ulo Store Architecture

The Ulo Store is unified package frontend wrapping `.ulo` packages (Flatpak based), `pacman` repositories, and the AUR.

## Backend Daemon (`ulo-pkgd`)
- **Language:** Rust (for memory safety and performance).
- **Interface:** DBus API exposing methods for the GTK4 Store frontend.

### Unified Repository Format
The Ulo Store aggregates multiple package sources into a single schema.

```json
{
  "app_id": "com.ulo.browser",
  "name": "Ulo Browser",
  "source": "core", // enum: core, flatpak, aur
  "type": "native", // enum: native, flatpak, wine
  "version": "1.0.5",
  "description": "Original Ulo Browser...",
  "permissions": ["network", "microphone", "filesystem:downloads"]
}
```

## CLI Tool (`ulo`)
The store is accessible via the `ulo` command.
- `ulo install <pkg>`: Auto-detects the best source (Flatpak > Core Repo > AUR).
- `ulo update`: Runs `pacman -Syu` and `flatpak update` atomically in the background.

## Sandboxing & Permissions (Ulo Design)
Native applications installed via `.ulo` (Flatpak) use the XDG Desktop Portal to request permissions (Camera, Mic, Files). The Store UI has a "Privacy" tab showing exactly what permissions an app requested.

## Windows / EXE Bridge
When a user attempts to install an `.exe` file via the Ulo Store or file manager, `ulo-pkgd` automatically:
1. Provisions a Bottles environment (Wine prefix).
2. Generates a `.desktop` shortcut in `~/.local/share/applications`.
3. Displays the app seamlessly alongside native Linux apps.
