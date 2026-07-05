const { ipcRenderer } = require('electron');

// Handle window close
document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

// Handle app installations
const installButtons = document.querySelectorAll('.install-btn');

installButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const appName = btn.getAttribute('data-app');
        
        // Update UI to show loading
        const originalText = btn.innerText;
        btn.innerText = 'Installing...';
        btn.classList.add('loading');
        btn.disabled = true;

        try {
            // Ask main process to run apt-get
            const result = await ipcRenderer.invoke('install-app', appName);
            
            if (result.success) {
                btn.innerText = 'Installed';
                btn.classList.remove('loading');
                btn.classList.add('success');
            } else {
                btn.innerText = 'Failed';
                btn.classList.remove('loading');
                console.error(result.error);
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        } catch (err) {
            btn.innerText = 'Error';
            btn.classList.remove('loading');
            console.error(err);
        }
    });
});
