const { ipcRenderer } = require('electron');

document.getElementById('hide-btn').addEventListener('click', () => {
    window.close(); 
});

const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatArea = document.getElementById('chat-area');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');

// Load existing API key on startup
ipcRenderer.invoke('get-api-key').then(key => {
    apiKeyInput.value = key;
});

settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = settingsModal.style.display === 'none' ? 'block' : 'none';
});

saveKeyBtn.addEventListener('click', async () => {
    await ipcRenderer.invoke('save-api-key', apiKeyInput.value);
    settingsModal.style.display = 'none';
    addMessage('API Key saved successfully.', 'system');
});

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = `message system`;
    typingMsg.textContent = 'Thinking...';
    chatArea.appendChild(typingMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    try {
        const response = await ipcRenderer.invoke('ask-ai', text);
        chatArea.removeChild(typingMsg);
        
        if (response.type === 'error') {
            addMessage(`❌ ${response.content}`, 'system');
        } else {
            addMessage(response.content, 'system');
        }
    } catch (e) {
        chatArea.removeChild(typingMsg);
        addMessage(`❌ System Error: ${e.message}`, 'system');
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
