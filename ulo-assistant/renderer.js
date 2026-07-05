const { ipcRenderer } = require('electron');

document.getElementById('hide-btn').addEventListener('click', () => {
    // Hide window, handled in main process on close
    window.close(); 
});

const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatArea = document.getElementById('chat-area');

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        addMessage("I am a prototype AI assistant. In Phase 4, I will be connected to the cloud to manage your system!", 'system');
    }, 1000);
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
