// ============================================
// EVENTS.JS - Event management and rendering
// ============================================

import { loadEvents as apiLoadEvents, saveEvent as apiSaveEvent, deleteEvent as apiDeleteEvent } from './api.js';
import { showToast, openEventsView, closeEventsView, openMilestonesView, closeMilestonesView, addPulseAnimation } from './ui.js';
import { getIconMap, setDefaultTime } from './utils.js';

let events = [];
let currentTimelineDate = new Date();

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

// Timeline rendering
export function renderTimeline() {
    const timeline = document.getElementById('timeline');
    const legend = document.getElementById('timelineLegend');
    if (!timeline) return;
    
    const dayStart = new Date(currentTimelineDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentTimelineDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Filter events for the current day
    const dayEvents = events.filter(event => {
        const eventDate = new Date(event.time);
        return eventDate >= dayStart && eventDate <= dayEnd;
    });

    if (dayEvents.length === 0) {
        timeline.innerHTML = `
            <div class="no-events-timeline">
                <div class="icon">📅</div>
                <h3>No events for this day</h3>
                <p>Add events to see them on the timeline</p>
            </div>
        `;
        if (legend) legend.style.display = 'none';
        const dailyStats = document.getElementById('dailyStats');
        if (dailyStats) dailyStats.style.display = 'none';
        renderDayEventList([]);
        return;
    }

    // Show legend and stats
    if (legend) legend.style.display = 'flex';
    const dailyStats = document.getElementById('dailyStats');
    if (dailyStats) dailyStats.style.display = 'grid';

    // Create horizontal timeline structure
    let timelineHTML = '<div class="timeline-horizontal">';
    
    // Hour labels (every 4 hours)
    timelineHTML += '<div class="timeline-hours-container">';
    for (let hour = 0; hour <= 23; hour++) {
        const hourStr = hour % 4 === 0 ? hour.toString().padStart(2, '0') : '';
        timelineHTML += `<div class="hour-tick">${hourStr}</div>`;
    }
    timelineHTML += '</div>';
    
    // Timeline track
    timelineHTML += '<div class="timeline-track" id="timelineTrack">';
    timelineHTML += '</div>';
    timelineHTML += '</div>';
    
    timeline.innerHTML = timelineHTML;

    // Process and render events
    const processedEvents = processEventsForTimeline(dayEvents);
    renderHorizontalEventBlocks(processedEvents);
    
    // Calculate and display daily stats
    calculateDailyStats(processedEvents, dayEvents);
    renderDayEventList(dayEvents);
}

// Navigate timeline date
export function navigateDate(direction) {
    currentTimelineDate.setDate(currentTimelineDate.getDate() + direction);
    updateTimelineDate();
    renderTimeline();
}

// Reset timeline date to today
export function resetTimelineDate() {
    currentTimelineDate = new Date();
}

// Update timeline date display
export function updateTimelineDate() {
    const today = new Date();
    const isToday = currentTimelineDate.toDateString() === today.toDateString();
    const dateStr = isToday ? 'Today' : currentTimelineDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: currentTimelineDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) currentDateEl.textContent = dateStr;
}

// Process events for timeline display
function processEventsForTimeline(dayEvents) {
    const processed = [];
    const used = new Set();

    // Sort events by time to ensure proper chronological order
    const sortedEvents = [...dayEvents].sort((a, b) => new Date(a.time) - new Date(b.time));

    // First, process paired events (start/end pairs)
    sortedEvents.forEach((event, index) => {
        if (used.has(event.id)) return;

        if (event.type.includes('Start')) {
            const baseType = event.type.replace(' Start', '');
            const endType = baseType + ' End';
            
            // Find corresponding end event (should come after this start event)
            const endEvent = sortedEvents.find((e, i) => 
                i > index && 
                e.type === endType && 
                !used.has(e.id) &&
                new Date(e.time) > new Date(event.time)
            );

            if (endEvent) {
                // Paired event - create duration block
                used.add(event.id);
                used.add(endEvent.id);
                
                processed.push({
                    type: 'duration',
                    category: baseType.toLowerCase(),
                    startTime: new Date(event.time),
                    endTime: new Date(endEvent.time),
                    icon: event.icon,
                    title: baseType,
                    notes: event.notes || endEvent.notes
                });
            } else {
                // Unpaired start event
                processed.push({
                    type: 'instant',
                    category: baseType.toLowerCase(),
                    time: new Date(event.time),
                    icon: event.icon,
                    title: event.type,
                    notes: event.notes
                });
                used.add(event.id);
            }
        } else if (event.type.includes('End')) {
            // Check if this end event is already paired
            if (!used.has(event.id)) {
                // Unpaired end event
                const baseType = event.type.replace(' End', '');
                processed.push({
                    type: 'instant',
                    category: baseType.toLowerCase(),
                    time: new Date(event.time),
                    icon: event.icon,
                    title: event.type,
                    notes: event.notes
                });
                used.add(event.id);
            }
        } else {
            // Single events (Diaper, Medicine, etc.)
            processed.push({
                type: 'instant',
                category: getCategoryFromType(event.type),
                time: new Date(event.time),
                icon: event.icon,
                title: event.type,
                notes: event.notes
            });
            used.add(event.id);
        }
    });

    return processed.sort((a, b) => {
        const timeA = a.type === 'duration' ? a.startTime : a.time;
        const timeB = b.type === 'duration' ? b.startTime : b.time;
        return timeA - timeB;
    });
}

function getCategoryFromType(type) {
    if (type.toLowerCase().includes('feed')) return 'feed';
    if (type.toLowerCase().includes('sleep')) return 'sleep';
    if (type.toLowerCase().includes('diaper')) return 'diaper';
    if (type.toLowerCase().includes('milestone')) return 'milestone';
    return 'other';
}

// Render horizontal event blocks on timeline
function renderHorizontalEventBlocks(processedEvents) {
    const timelineTrack = document.getElementById('timelineTrack');
    if (!timelineTrack) return;
    
    // Clear existing content
    timelineTrack.innerHTML = '';
    
    processedEvents.forEach((event) => {
        if (event.type === 'duration') {
            // Create colored section for duration events
            const coloredSection = document.createElement('div');
            coloredSection.className = `timeline-colored-section ${event.category}`;
            
            const startPercent = getTimePercentage(event.startTime);
            const endPercent = getTimePercentage(event.endTime);
            const width = endPercent - startPercent;
            
            coloredSection.style.left = `${startPercent}%`;
            coloredSection.style.width = `${width}%`;
            
            // Add tooltip
            const startTimeStr = event.startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            const endTimeStr = event.endTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            coloredSection.title = `${event.title}: ${startTimeStr} - ${endTimeStr}${event.notes ? '\n' + event.notes : ''}`;
            
            timelineTrack.appendChild(coloredSection);
            
            // Create start marker
            const startMarker = document.createElement('div');
            startMarker.className = 'event-marker';
            startMarker.style.left = `${startPercent}%`;
            
            const startIcon = document.createElement('div');
            startIcon.className = 'event-marker-icon';
            startIcon.innerHTML = event.icon;
            startIcon.title = `${event.title} Start - ${startTimeStr}${event.notes ? '\n' + event.notes : ''}`;
            startIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventInfo(`${event.title} Start`, startTimeStr, e.clientX, e.clientY);
            });
            startMarker.appendChild(startIcon);
            timelineTrack.appendChild(startMarker);
            
            // Create end marker
            const endMarker = document.createElement('div');
            endMarker.className = 'event-marker';
            endMarker.style.left = `${endPercent}%`;
            
            const endIcon = document.createElement('div');
            endIcon.className = 'event-marker-icon';
            endIcon.innerHTML = event.icon;
            endIcon.title = `${event.title} End - ${endTimeStr}${event.notes ? '\n' + event.notes : ''}`;
            endIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventInfo(`${event.title} End`, endTimeStr, e.clientX, e.clientY);
            });
            endMarker.appendChild(endIcon);
            timelineTrack.appendChild(endMarker);
            
        } else {
            // Create instant event marker
            const instantMarker = document.createElement('div');
            instantMarker.className = 'instant-event-marker';
            
            const timePercent = getTimePercentage(event.time);
            instantMarker.style.left = `${timePercent}%`;
            
            const timeStr = event.time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            const instantIcon = document.createElement('div');
            instantIcon.className = 'event-marker-icon';
            instantIcon.innerHTML = event.icon;
            instantIcon.title = `${event.title} - ${timeStr}${event.notes ? '\n' + event.notes : ''}`;
            instantIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                showEventInfo(event.title, timeStr, e.clientX, e.clientY);
            });
            
            instantMarker.appendChild(instantIcon);
            timelineTrack.appendChild(instantMarker);
        }
    });
}

function getTimePercentage(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + (milliseconds / 1000);
    return (totalSeconds / (24 * 3600)) * 100;
}

function showEventInfo(eventType, timeStr, x, y) {
    // Update popup content with simple event information
    const clickedTimeEl = document.getElementById('clickedTime');
    const eventsContainer = document.getElementById('clickedEvents');
    if (!clickedTimeEl || !eventsContainer) return;
    
    clickedTimeEl.textContent = timeStr;
    
    // Get the icon from the event type
    const iconMap = {
        'Feed Start': '🍼', 'Feed End': '🍼', 'Feed': '🍼',
        'Sleep Start': '😴', 'Sleep End': '😴', 'Sleep': '😴',
        'Diaper': '🩱', 'Medicine': '💊', 'Bath': '🛁',
        'Doctor': '👨‍⚕️', 'Milestone': '⭐', 'Other': '📝'
    };
    
    const baseType = eventType.replace(' Start', '').replace(' End', '');
    const icon = iconMap[eventType] || iconMap[baseType] || '📝';
    
    eventsContainer.innerHTML = `
        <div class="event-item">
            <span>${icon}</span>
            <span>${eventType}</span>
        </div>
    `;
    
    // Position and show popup with better positioning
    const popup = document.getElementById('timelineClickInfo');
    if (!popup) return;
    
    popup.style.left = `${Math.max(10, Math.min(x - 90, window.innerWidth - 200))}px`;
    popup.style.top = `${y - 12}px`;
    popup.classList.add('show');
    
    // Hide popup after 2.5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500);
}

function calculateDailyStats(processedEvents, dayEvents) {
    let totalSleepMinutes = 0;
    let totalFeedMinutes = 0;
    let diaperCount = 0;
    let totalEvents = dayEvents.length;

    // Calculate duration stats from processed events
    processedEvents.forEach(event => {
        if (event.type === 'duration') {
            const durationMs = event.endTime - event.startTime;
            const durationMinutes = Math.round(durationMs / (1000 * 60));
            
            if (event.category === 'sleep') {
                totalSleepMinutes += durationMinutes;
            } else if (event.category === 'feed') {
                totalFeedMinutes += durationMinutes;
            }
        } else {
            // Count instant events
            if (event.category === 'diaper') {
                diaperCount++;
            }
        }
    });

    // Format durations
    const formatDuration = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    };

    // Update UI
    const sleepDurationEl = document.getElementById('sleepDuration');
    const feedDurationEl = document.getElementById('feedDuration');
    const diaperCountEl = document.getElementById('diaperCount');
    const totalEventsEl = document.getElementById('totalEvents');
    
    if (sleepDurationEl) sleepDurationEl.textContent = formatDuration(totalSleepMinutes);
    if (feedDurationEl) feedDurationEl.textContent = formatDuration(totalFeedMinutes);
    if (diaperCountEl) diaperCountEl.textContent = diaperCount.toString();
    if (totalEventsEl) totalEventsEl.textContent = totalEvents.toString();
}

// Render list of events for the selected day
function renderDayEventList(dayEvents) {
    const list = document.getElementById('dayEventList');
    if (!list) return;

    if (!dayEvents || dayEvents.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <h3>No events for this day</h3>
                <p>Add events to see them here</p>
            </div>
        `;
        return;
    }

    // Sort events by time (newest first)
    const sortedEvents = [...dayEvents].sort((a, b) => new Date(b.time) - new Date(a.time));

    list.innerHTML = sortedEvents.map(event => {
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

// Global functions for onclick handlers
window.editEvent = editEvent;
window.deleteEventHandler = deleteEventHandler;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.quickEvent = quickEvent;
window.navigateDate = navigateDate;

