// ============================================
// UI.JS - UI utilities and view management
// ============================================

import { loadAndRenderEvents, updateTimelineDate, resetTimelineDate } from './events.js';

// Show toast notification
export function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Show alert toast (for Owlet alerts)
export function showAlertToast(message, type = 'warning') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'danger' ? '#ef4444' : '#f59e0b'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal functions
export function openModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('active');
    }
}

export function closeModal() {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    
    if (modal) {
        modal.classList.remove('active');
    }
    if (form) {
        form.reset();
    }
    
    // Reset modal to add mode
    const header = document.querySelector('#eventModal .modal-header h2');
    const submitBtn = document.querySelector('#eventModal .btn-primary');
    if (header) header.textContent = 'Add Event';
    if (submitBtn) submitBtn.textContent = 'Save Event';
    if (form) delete form.dataset.editingId;
}

// View navigation
export function openEventsView() {
    const eventsView = document.getElementById('eventsView');
    const gridContainer = document.getElementById('gridContainer');
    if (eventsView) eventsView.classList.add('active');
    if (gridContainer) gridContainer.classList.add('hidden');
}

export function closeEventsView() {
    const eventsView = document.getElementById('eventsView');
    const gridContainer = document.getElementById('gridContainer');
    if (eventsView) eventsView.classList.remove('active');
    if (gridContainer) gridContainer.classList.remove('hidden');
}

export function openMilestonesView() {
    const milestonesView = document.getElementById('milestonesView');
    const gridContainer = document.getElementById('gridContainer');
    if (milestonesView) milestonesView.classList.add('active');
    if (gridContainer) gridContainer.classList.add('hidden');
}

export function closeMilestonesView() {
    const milestonesView = document.getElementById('milestonesView');
    const gridContainer = document.getElementById('gridContainer');
    if (milestonesView) milestonesView.classList.remove('active');
    if (gridContainer) gridContainer.classList.remove('hidden');
}

export function openOwletView() {
    const owletView = document.getElementById('owletView');
    const gridContainer = document.getElementById('gridContainer');
    if (owletView) owletView.classList.add('active');
    if (gridContainer) gridContainer.classList.add('hidden');
}

export function closeOwletView() {
    const owletView = document.getElementById('owletView');
    const gridContainer = document.getElementById('gridContainer');
    if (owletView) owletView.classList.remove('active');
    if (gridContainer) gridContainer.classList.remove('hidden');
}

export function openDayTimelineView() {
    const dayTimelineView = document.getElementById('dayTimelineView');
    const gridContainer = document.getElementById('gridContainer');
    if (dayTimelineView) dayTimelineView.classList.add('active');
    if (gridContainer) gridContainer.classList.add('hidden');
    
    // Reset timeline date to today and load events
    resetTimelineDate();
    loadAndRenderEvents().then(() => {
        updateTimelineDate();
    });
}

export function closeDayTimelineView() {
    const dayTimelineView = document.getElementById('dayTimelineView');
    const gridContainer = document.getElementById('gridContainer');
    if (dayTimelineView) dayTimelineView.classList.remove('active');
    if (gridContainer) gridContainer.classList.remove('hidden');
}

// Pulse animation on button
export function addPulseAnimation(button) {
    if (button) {
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 600);
    }
}

