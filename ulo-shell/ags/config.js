// a) Purpose: Main entry point for UloShell UI (built on Aylur's GTK Shell).
// c) Install/Test: Launch via `ags -c ~/.config/ags/config.js`
// d) Open decisions: Kept as a scaffold showing how Dock, TopBar, and Launcher are instantiated.

import App from 'resource:///com/github/Aylur/ags/app.js';
import { TopBar } from './topbar.js';
import { Dock } from './dock.js';
import { AppLauncher } from './launcher.js';
import { QuickSettings } from './quicksettings.js';
import { UloAgentWindow } from './agent.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

// Apply Ulo Design Language SCSS
const scss = `${App.configDir}/style.scss`;
const css = `/tmp/ulo-style.css`;
Utils.exec(`sassc ${scss} ${css}`);

// Initialize the UI windows
export default {
    style: css,
    windows: [
        TopBar(),       // Mac-style top menu with global search & sys tray
        Dock(),         // Centered app dock
        AppLauncher(),  // Ulo Start Menu (hidden by default)
        QuickSettings(),// Wi-Fi, Bluetooth, Agent toggles
        UloAgentWindow()// Floating AI agent chat & status
    ],
    closeWindowDelay: {
        'app-launcher': 150,
        'quick-settings': 150,
    },
};
