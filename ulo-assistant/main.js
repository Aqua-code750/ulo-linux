const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { GoogleGenAI } = require('@google/genai');

let mainWindow;
const configDir = path.join(app.getPath('userData'), 'UloAssistant');
const configPath = path.join(configDir, 'config.json');

// Ensure config dir exists
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

function getApiKey() {
    try {
        if (fs.existsSync(configPath)) {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return data.apiKey || '';
        }
    } catch (e) {
        console.error("Error reading config", e);
    }
    return '';
}

function saveApiKey(key) {
    try {
        let data = {};
        if (fs.existsSync(configPath)) {
            data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        data.apiKey = key;
        fs.writeFileSync(configPath, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Error saving config", e);
        return false;
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        x: 1500, // Top right corner (approximate)
        y: 50,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true, // Don't show in taskbar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    
    // Hide initially instead of closing
    mainWindow.on('close', (e) => {
        if (!app.isQuiting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    // Toggle window on Ctrl+Space (if run outside of Cinnamon shortcuts)
    globalShortcut.register('CommandOrControl+Space', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// IPC Handlers
ipcMain.handle('get-api-key', () => {
    return getApiKey();
});

ipcMain.handle('save-api-key', (event, key) => {
    return saveApiKey(key);
});

ipcMain.handle('ask-ai', async (event, prompt) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { type: 'error', content: 'No API key configured. Please set your Gemini API key in the settings.' };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const systemPrompt = `You are the Ulo Assistant, an AI integrated deeply into Ulo Linux.
You can answer questions normally, OR you can execute bash commands on the user's system to perform actions.
If the user asks you to perform an action (e.g. "change the wallpaper", "open calculator", "install a package"), you MUST output ONLY a valid JSON object in this format:
{"action": "command", "command": "the bash command to run"}
If the user is just asking a question (e.g. "how do I use git", "what time is it"), output ONLY a JSON object in this format:
{"action": "reply", "message": "your text response here"}
DO NOT output markdown backticks around the JSON. ONLY output the raw JSON string.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemPrompt
            }
        });

        const text = response.text.trim();
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            // Fallback if AI didn't return perfect JSON
            return { type: 'reply', content: text };
        }

        if (parsed.action === 'command') {
            // Execute the command locally
            return new Promise((resolve) => {
                exec(parsed.command, (error, stdout, stderr) => {
                    if (error) {
                        resolve({ type: 'reply', content: `Error executing command: ${error.message}` });
                        return;
                    }
                    resolve({ type: 'reply', content: `Executed command successfully.` });
                });
            });
        } else {
            return { type: 'reply', content: parsed.message || 'I processed your request.' };
        }

    } catch (e) {
        return { type: 'error', content: `API Error: ${e.message}` };
    }
});
