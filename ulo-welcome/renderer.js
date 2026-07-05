const { ipcRenderer } = require('electron');

// Handle close button for custom titlebar
document.getElementById('close-btn').addEventListener('click', () => {
    window.close(); // Only works if nodeIntegration is enabled and contextIsolation is false
});

// Slide navigation
let currentSlide = 1;

function nextSlide(slideNumber) {
    const current = document.getElementById(`slide-${currentSlide}`);
    const next = document.getElementById(`slide-${slideNumber}`);

    // Slide out current
    current.classList.remove('active');
    current.classList.add('fade-out');

    setTimeout(() => {
        current.classList.remove('fade-out');
        // Slide in next
        next.classList.add('active');
        currentSlide = slideNumber;
    }, 300); // Wait for fade out animation
}

// Theme Selection
function selectTheme(theme, element) {
    // Remove active from all options
    document.querySelectorAll('.theme-option').forEach(el => {
        el.classList.remove('active');
    });
    
    // Add active to selected
    element.classList.add('active');

    // Here we would normally communicate with the OS to change the actual theme.
    // For now, we'll just log it.
    console.log(`Theme selected: ${theme}`);
}

function finishSetup() {
    window.close(); // Close the welcome app
}
