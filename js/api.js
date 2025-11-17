// ============================================
// API.JS - All API calls and backend communication
// ============================================

import { APP_VERSION } from './utils.js';

// Load all events from server
export function loadEvents() {
    return fetch(`api/events.php?v=${APP_VERSION}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error loading events:', error);
            throw error;
        });
}

// Save single event to server
export function saveEvent(event) {
    return fetch(`api/events.php?v=${APP_VERSION}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save event');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            return true;
        } else {
            throw new Error(data.error || 'Failed to save event');
        }
    })
    .catch(error => {
        console.error('Error saving event:', error);
        throw error;
    });
}

// Delete event from server
export function deleteEvent(eventId) {
    return fetch(`api/events.php?v=${APP_VERSION}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete');
        return response.json();
    })
    .catch(error => {
        console.error('Error deleting event:', error);
        throw error;
    });
}

// Get Owlet vitals data
export function getOwletVitals() {
    return fetch('api/events.php?vitals=true')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch vitals');
            return response.json();
        })
        .catch(error => {
            console.error('Error loading Owlet data:', error);
            throw error;
        });
}

// Get Owlet latest reading
export function getOwletLatest() {
    return fetch('api/events.php?latest=true')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch latest');
            return response.json();
        })
        .catch(error => {
            console.error('Error loading latest Owlet data:', error);
            throw error;
        });
}

// Get Owlet summaries
export function getOwletSummaries() {
    return fetch('api/events.php?summaries=true')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch summaries');
            return response.json();
        })
        .catch(error => {
            console.error('Error loading Owlet summaries:', error);
            throw error;
        });
}

// Get today's hourly data
export function getTodaysHourly() {
    return fetch('api/events.php?todays_hourly=true')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch today\'s hourly');
            return response.json();
        })
        .catch(error => {
            console.error('Error loading today\'s hourly data:', error);
            throw error;
        });
}

