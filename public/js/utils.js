// ============================================
// UTILS.JS - Helper functions and utilities
// ============================================

export const APP_VERSION = '1.2';

// Format date and time utilities
export function setDefaultTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('eventTime').value = now.toISOString().slice(0, 16);
}

export function getIconMap() {
    return {
        'Feed': '🍼',
        'Sleep': '😴',
        'Diaper': '🩱',
        'Medicine': '💊',
        'Bath': '🛁',
        'Doctor': '👨‍⚕️',
        'Milestone': '⭐',
        'Other': '📝',
        'Feed Start': '🍼',
        'Feed End': '🍼',
        'Sleep Start': '😴',
        'Sleep End': '😴'
    };
}

export function playAlertSound() {
    // Simple beep alert using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio alert not available');
    }
}

export function formatVitalStatus(value, low, high) {
    if (value === null || value === undefined) return 'gray';
    if (typeof value === 'number') {
        if (value < low || value > high) return 'red';
        return 'green';
    }
    return 'gray';
}

export function getColorForStatus(status) {
    switch(status) {
        case 'green': return '#10b981';
        case 'red': return '#ef4444';
        default: return '#cbd5e1';
    }
}

