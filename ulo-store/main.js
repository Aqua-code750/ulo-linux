const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        frame: false,
        backgroundColor: '#0a0a0a',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app installation via apt
ipcMain.handle('install-app', async (event, appName) => {
    return new Promise((resolve, reject) => {
        // We use pkexec to run apt-get as root with a GUI password prompt
        const command = `pkexec apt-get install -y ${appName}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error.message}`);
                resolve({ success: false, error: error.message });
                return;
            }
            resolve({ success: true, output: stdout });
        });
    });
});

ipcMain.on('close-window', () => {
    app.quit();
});
