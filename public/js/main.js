// ============================================
// MAIN.JS - Application initialization
// ============================================

import { setDefaultTime } from './utils.js';
import { handleEventFormSubmit, loadAndRenderEvents, openEventModal, closeEventModal } from './events.js';
import { openEventsView, closeEventsView, openMilestonesView, closeMilestonesView, openDayTimelineView, closeDayTimelineView, openOwletView, closeOwletView } from './ui.js';

// Global app initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Baby Monitor app loading...');
    
    // Set initial time for form
    setDefaultTime();
    
    // Load events on startup
    loadAndRenderEvents();
    
    // Form submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventFormSubmit);
    }
    
    console.log('Baby Monitor app initialized');
});

// Global functions for onclick handlers
window.setDefaultTime = setDefaultTime;
window.openModal = openEventModal;
window.closeModal = closeEventModal;
window.openEventsView = openEventsView;
window.closeEventsView = closeEventsView;
window.openMilestonesView = openMilestonesView;
window.closeMilestonesView = closeMilestonesView;
window.openDayTimelineView = openDayTimelineView;
window.closeDayTimelineView = closeDayTimelineView;
window.openOwletView = openOwletView;
window.closeOwletView = closeOwletView;

