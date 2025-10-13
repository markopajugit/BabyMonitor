# Baby Monitor App

A simple, mobile-first web application for tracking baby events and milestones.

## Overview
This app is designed to be added to the iOS home screen as a web app. It provides quick and easy event tracking for parents monitoring their baby's daily activities.

## Design Goals
- **Speed**: Any action should take less than 10 seconds
- **Simplicity**: Minimal UI, intuitive controls
- **Mobile-First**: Optimized for iOS devices
- **No Page Refreshes**: Single Page Application with smooth animations
- **Touch-Friendly**: Large buttons for easy tapping

## Features

### Main Grid (4x2 Layout)
The home screen features up to 8 large, touch-friendly buttons:

1. **Add Event** (Top Left)
   - Opens modal to add custom event
   - Fields: Event type, description, time (defaults to now)
   - Quick save functionality

2. **View Events** (Top Right)
   - Shows chronological list of all events
   - Filter by date/type
   - Swipe to delete

3. **Quick Feed** (Middle Left, Row 1)
   - One-tap to log feeding event
   - Shows timestamp notification
   - Optional: tap and hold for details (bottle/breast, amount)

4. **Quick Sleep** (Middle Right, Row 1)
   - One-tap to log sleep event
   - Toggle for "sleep start" vs "wake up"
   - Shows duration if logging wake up

5. **Quick Diaper** (Middle Left, Row 2)
   - One-tap to log diaper change
   - Optional: tap and hold for type (wet/dirty/both)

6. **Milestone** (Middle Right, Row 2)
   - Log developmental milestones
   - Opens form with description and date
   - Examples: first smile, first steps, etc.

*Note: Grid can be simplified to 6 buttons (3x2) if preferred for larger touch targets*

### Event Types
- Feed/Eat (bottle, breast, solid food)
- Sleep (start/end times, duration)
- Diaper Change (wet, dirty, both)
- Medicine/Doctor Visit
- Bath Time
- Milestone
- Custom/Notes

### Event Properties
- Type (required)
- Timestamp (defaults to now)
- Notes/Description (optional)
- Additional metadata based on type

## Technical Stack

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (or lightweight framework)
- Progressive Web App (PWA) capabilities
- Service Worker for offline functionality

### Backend
- PHP
- MySQL Database
- RESTful API endpoints

## User Flows

### Quick Event (3 seconds)
1. Tap quick action button (Feed, Sleep, or Diaper)
2. See confirmation animation
3. Continue using app

### Custom Event (5-8 seconds)
1. Tap "Add Event"
2. Select type from dropdown
3. Add optional notes
4. Tap Save
5. Return to main grid

### View Events (2-5 seconds)
1. Tap "View Events"
2. Scroll through list
3. Tap event to see details
4. Swipe or tap delete to remove
5. Tap back to return to grid

## UI/UX Principles
- **Large Touch Targets**: Minimum 60px buttons with spacing
- **Clear Visual Feedback**: Animations on tap, success states
- **Default Values**: Timestamp always defaults to "now"
- **Color Coding**: Each event type has distinct color
- **Minimal Input**: Reduce typing, use dropdowns and presets
- **Haptic Feedback**: Vibration on successful action (mobile)

## Future Enhancements
- Statistics dashboard (feeding patterns, sleep duration)
- Export data (CSV, PDF reports)
- Multi-baby support
- Sharing with partner/caregiver
- Photo attachments for milestones
- Notifications/reminders

