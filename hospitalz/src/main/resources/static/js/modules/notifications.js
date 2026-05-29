// notifications.js - Global Custom Popup/Toast System with Cross-Tab Synchronization

let toastContainer = null;
const bc = new BroadcastChannel('hospitalz_notifications');

// Initialize toast container in DOM
function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

/**
 * Creates and displays a toast notification
 * @param {string} message - The text message to display
 * @param {string} type - success, error, warning, info
 * @param {boolean} [shouldBroadcast=true] - Whether to send this to other tabs
 */
export function showToast(message, type = 'info', shouldBroadcast = true) {
    const container = getToastContainer();
    
    // Create notification card
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    // Icon selection
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    else if (type === 'error') iconClass = 'fa-circle-xmark';
    else if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="toast-body">${message}</div>
        <button class="toast-close" title="Close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="toast-progress">
            <div class="toast-progress-bar"></div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Trigger slide-in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    const duration = 4000; // 4 seconds duration
    const progressBar = toast.querySelector('.toast-progress-bar');
    progressBar.style.animationDuration = `${duration}ms`;
    
    let dismissTimeout;
    
    // Close function
    const closeToast = () => {
        toast.classList.replace('show', 'hide');
        // Wait for slide-out transition
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    };
    
    // Set auto close timer
    const startTimer = () => {
        dismissTimeout = setTimeout(closeToast, duration);
        progressBar.style.animationPlayState = 'running';
    };
    
    const pauseTimer = () => {
        clearTimeout(dismissTimeout);
        progressBar.style.animationPlayState = 'paused';
    };
    
    // Click close button
    toast.querySelector('.toast-close').addEventListener('click', closeToast);
    
    // Pause auto-close on hover
    toast.addEventListener('mouseenter', pauseTimer);
    toast.addEventListener('mouseleave', startTimer);
    
    // Start timer initially
    startTimer();
    
    // Sync with other open browser tabs
    if (shouldBroadcast) {
        bc.postMessage({ message, type });
    }
}

// Listen for notifications from other browser tabs
bc.onmessage = (event) => {
    const { message, type } = event.data;
    // Show toast locally, do not rebroadcast
    showToast(message, type, false);
};

// Override window.alert to automatically use our premium toast system
window.alert = function(message) {
    // Try to auto-detect message type from content
    let type = 'info';
    const lowerMessage = String(message).toLowerCase();
    if (lowerMessage.includes('error') || lowerMessage.includes('fail') || lowerMessage.includes('invalid') || lowerMessage.includes('update error')) {
        type = 'error';
    } else if (lowerMessage.includes('success') || lowerMessage.includes('updated') || lowerMessage.includes('completed') || lowerMessage.includes('registered') || lowerMessage.includes('started') || lowerMessage.includes('accepted')) {
        type = 'success';
    } else if (lowerMessage.includes('warning') || lowerMessage.includes('please') || lowerMessage.includes('attention') || lowerMessage.includes('select')) {
        type = 'warning';
    }
    
    showToast(message, type);
};

// Expose showToast globally to window so that modules don't have to import it
window.showToast = showToast;
