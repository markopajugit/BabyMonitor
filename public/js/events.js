// ============================================
// EVENTS.JS - Event management and rendering
// ============================================

import { loadEvents as apiLoadEvents, saveEvent as apiSaveEvent, deleteEvent as apiDeleteEvent } from './api.js';
import { showToast, openEventsView, closeEventsView, openMilestonesView, closeMilestonesView } from './ui.js';
import { getIconMap, setDefaultTime, addPulseAnimation } from './utils.js';

let events = [];

// Load events and refresh views
export async function loadAndRenderEvents() {
    try {
        events = await apiLoadEvents();
        if (document.getElementById('eventsView')?.classList.contains('active')) {
            renderEvents();
        }
        if (document.getElementById('dayTimelineView')?.classList.contains('active')) {
            renderTimeline();
        }
        return true;
    } catch (error) {
        console.error('Error loading events:', error);
        showToast('Failed to load events');
        return false;
    }
}

// Save event and reload
export async function quickEvent(type, icon) {
    const event = {
        id: Date.now(),
        type: type,
        icon: icon,
        time: new Date().toISOString(),
        notes: ''
    };
    
    // Pulse animation
    const targetBtn = window.event?.target?.closest('.grid-btn');
    addPulseAnimation(targetBtn);
    
    try {
        await apiSaveEvent(event);
        showToast(`${icon} ${type} recorded!`);
        await loadAndRenderEvents();
    } catch (error) {
        showToast('Failed to save event');
    }
}

// Handle form submission
export async function handleEventFormSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('eventType').value;
    const time = document.getElementById('eventTime').value;
    const notes = document.getElementById('eventNotes').value;
    const form = document.getElementById('eventForm');
    const editingId = form?.dataset.editingId;
    
    const iconMap = getIconMap();
    
    const event = {
        id: editingId ? parseInt(editingId) : Date.now(),
        type: type,
        icon: iconMap[type],
        time: new Date(time).toISOString(),
        notes: notes
    };
    
    try {
        await apiSaveEvent(event);
        closeEventModal();
        const action = editingId ? 'updated' : 'recorded';
        showToast(`${iconMap[type]} ${type} ${action}!`);
        await loadAndRenderEvents();
    } catch (error) {
        showToast('Failed to save event');
    }
}

// Render events list
export function renderEvents() {
    const list = document.getElementById('eventList');
    if (!list) return;
    
    if (!events || events.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <h3>No events yet</h3>
                <p>Start tracking your baby's activities</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = events.map(event => {
        const date = new Date(event.time);
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const typeClass = event.type.toLowerCase();
        
        return `
            <div class="event-item">
                <div class="event-icon ${typeClass}">${event.icon}</div>
                <div class="event-details">
                    <div class="event-type">${event.type}</div>
                    <div class="event-time">${timeStr}</div>
                    ${event.notes ? `<div class="event-notes">${event.notes}</div>` : ''}
                </div>
                <div style="margin-left: auto; display: flex; gap: 8px;">
                    <button class="edit-btn" onclick="window.editEvent(${event.id})" style="background: var(--primary); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;">Edit</button>
                    <button class="delete-btn" onclick="window.deleteEventHandler(${event.id})" style="background: #ef4444; color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Delete event handler
export async function deleteEventHandler(eventId) {
    if (!confirm('Delete this event?')) return;
    try {
        await apiDeleteEvent(eventId);
        showToast('Event deleted');
        await loadAndRenderEvents();
    } catch (error) {
        showToast('Failed to delete event');
    }
}

// Edit event handler
export function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('eventType').value = event.type;
    const dateObj = new Date(event.time);
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    document.getElementById('eventTime').value = dateObj.toISOString().slice(0, 16);
    document.getElementById('eventNotes').value = event.notes || '';
    
    const form = document.getElementById('eventForm');
    form.dataset.editingId = eventId;
    
    const header = document.querySelector('#eventModal .modal-header h2');
    const submitBtn = document.querySelector('#eventModal .btn-primary');
    header.textContent = 'Edit Event';
    submitBtn.textContent = 'Update Event';
    
    openEventModal();
}

// Modal management
export function openEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('active');
        setDefaultTime();
    }
}

export function closeEventModal() {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    
    if (modal) {
        modal.classList.remove('active');
    }
    if (form) {
        form.reset();
        delete form.dataset.editingId;
    }
    
    const header = document.querySelector('#eventModal .modal-header h2');
    const submitBtn = document.querySelector('#eventModal .btn-primary');
    if (header) header.textContent = 'Add Event';
    if (submitBtn) submitBtn.textContent = 'Save Event';
}

// Milestones rendering
export function renderMilestones() {
    const grid = document.getElementById('milestonesGrid');
    if (!grid) return;
    
    const milestoneEvents = events.filter(e => e.type === 'Milestone').slice(0, 6);
    
    if (milestoneEvents.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
                <div style="font-size: 60px; margin-bottom: 15px;">⭐</div>
                <h3>No milestones yet</h3>
                <p>Record your baby's special moments</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = milestoneEvents.map(event => {
        const date = new Date(event.time);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div class="milestone-box">
                <div class="milestone-icon">${event.icon}</div>
                <div class="milestone-title">${event.type}</div>
                <div class="milestone-date">${dateStr}</div>
            </div>
        `;
    }).join('');
}

// Timeline rendering (placeholder)
export function renderTimeline() {
    // This would contain complex timeline rendering logic
    // For now, just load events for the day view
}

// Global functions for onclick handlers
window.editEvent = editEvent;
window.deleteEventHandler = deleteEventHandler;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.quickEvent = quickEvent;

