# a) Purpose: Spec and wireframes for the Ulo First-Boot Wizard (`ulo-welcome`).
# c) Install/Test: This app runs automatically on first login to the UloShell.
# d) Open decisions: Using GTK4 + libadwaita for the wizard UI to ensure smooth animations.

# Ulo Welcome (First-Boot Wizard)

The wizard is a single-window GTK4 application (or AGS window) that opens fullscreen upon the very first login.

## Screen 1: Welcome & Theme Selection
- **Header:** "Welcome to Ulo Linux"
- **Content:** Three large buttons displaying a preview of the UloShell.
  - [ Light Mode ]
  - [ Dark Mode ]
  - [ Auto (Syncs with Sunset) ]
- **Action:** Clicking a theme instantly applies the AGS/Hyprland theme dynamically via DBus without restarting the shell.

## Screen 2: Use-Case Selector (App Bundles)
- **Header:** "How will you use Ulo?"
- **Content:** Checkboxes (multiple selection allowed).
  - [x] **Coding** (Installs: Docker, Python, Ulo Code language servers)
  - [ ] **Gaming** (Installs: Steam, Lutris, GameMode)
  - [x] **Office & Creative** (Installs: Ulo Office, Ulo Media Suite)
  - [ ] **Just Browsing** (Minimal install)
- **Action:** Sends a bulk install command to `ulo-pkgd` running in the background. A progress bar appears at the bottom.

## Screen 3: The Ulo Agent
- **Header:** "Meet your Co-Pilot"
- **Content:** 
  - A brief animation showing the Super+A hotkey being pressed, and someone typing "switch to dark mode".
  - **Privacy Consent:** "Ulo Agent runs locally on your machine. No data is sent to the cloud unless you explicitly enable a cloud provider."
  - [ Enable Ulo Agent ] [ Disable Agent ]

## Screen 4: Ready
- **Header:** "You're all set!"
- **Content:** "Ulo is optimizing your packages in the background. You can start exploring now."
- **Action:** [ Go to Desktop ] -> Fades out the wizard, revealing the clean UloShell desktop.
