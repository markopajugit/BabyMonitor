# Baby Monitor

Simple, mobile‑first web app to quickly log baby events (feed, sleep, diaper, doctor, milestones, notes) with optional Owlet Smart Sock integration for real‑time vital monitoring.

## Overview

The app is designed to be added to an iOS home screen and used like a lightweight native app. UI is intentionally minimal and touch‑first: large tiles on a grid for one‑tap actions and multiple views to review history, milestones, daily timelines, and vital signs.

### Key Features

- ✅ **Quick Event Logging** - One-tap logging for Feed Start/End, Sleep Start/End, and Diaper changes
- ✅ **Custom Events** - Add detailed events with notes (Medicine, Bath, Doctor Visit, Milestones, etc.)
- ✅ **Day Timeline View** - Visual timeline showing sleep and feed periods with daily statistics
- ✅ **Milestones View** - Dedicated view for tracking baby's special moments
- ✅ **Owlet Integration** - Real-time vital monitoring (heart rate, oxygen level, movement) with historical charts
- ✅ **PWA Support** - Install as a standalone app on iOS/Android
- ✅ **Offline-First** - Works locally, no internet required for basic event tracking

## Tech Stack

- **Frontend:** `index.html` (HTML/CSS/vanilla JS), PWA manifest and icons
- **Backend:** `events.php` (single PHP file)
- **Storage:** `events.json` (flat JSON file on disk)
- **Optional:** `owlet_sync.py` (Python service for Owlet Smart Sock data)
- **Charts:** Chart.js for vital sign visualization

No database, no auth, just simple CRUD via PHP.

## Quick Start

### Prerequisites

- PHP 8+ in your PATH
- (Optional) Python 3.7+ for Owlet integration

### Running the Server

From the project root:

**Windows:**
```bash
php -S 0.0.0.0:8000 -t C:\Projects\BabyMonitor
```

**Linux/Mac:**
```bash
php -S 0.0.0.0:8000 -t /path/to/BabyMonitor
```

Then open `http://localhost:8000` on your computer.

### Using on iPhone

1. **Find your computer's IP address:**
   - **Windows:** Open Command Prompt (Win + R, type `cmd`), run `ipconfig`, look for "IPv4 Address" under your WiFi adapter
   - **Linux/Mac:** Run `ifconfig` or `ip addr`, look for your WiFi adapter's IP address
   - Example: `192.168.1.100`

2. **On your iPhone Safari, navigate to:**
   - `http://YOUR-IP-ADDRESS:8000` (e.g., `http://192.168.1.100:8000`)
   - **Make sure your iPhone and computer are on the same WiFi network!**

3. **Add to Home Screen:**
   - Tap the **Share** button (square with arrow pointing up)
   - Scroll down and tap **"Add to Home Screen"**
   - Name it "Baby Monitor"
   - Tap **"Add"**
   - The app will appear on your home screen with the diaper icon
   - Tap it to launch in full-screen mode (no Safari UI)

### Using on Android

1. Follow the same steps as iPhone to access the app via your computer's IP address
2. In Chrome, tap the menu (three dots) → **"Add to Home screen"**
3. The app will install as a PWA and launch in standalone mode

## Using the App

### Main Grid View

The home screen displays a grid of quick-action buttons:

- **💓 Owlet Monitor** - View real-time vital signs and charts
- **📅 View Day** - See today's timeline with sleep/feed periods
- **⭐ View Milestones** - Browse all recorded milestones
- **🩱 Quick Diaper** - One-tap diaper change logging
- **🍼 Feed Start/End** - Log feeding sessions
- **😴 Sleep Start/End** - Log sleep periods

### Quick Events (One-Tap)

Tap any of these buttons to instantly log an event with the current timestamp:
- **Feed Start** / **Feed End** - Track feeding sessions
- **Sleep Start** / **Sleep End** - Track sleep periods
- **Quick Diaper** - Log diaper changes

### Custom Events

1. Tap any quick-action button (opens the event modal)
2. Select event type from dropdown:
   - 🍼 Feed Start / Feed End
   - 😴 Sleep Start / Sleep End
   - 🩱 Diaper Change
   - 💊 Medicine
   - 🛁 Bath Time
   - 👨‍⚕️ Doctor Visit
   - ⭐ Milestone
   - 📝 Other
3. Time is pre-filled with current time (adjustable)
4. Add optional notes
5. Tap **"Save Event"**

### Day Timeline View

The **View Day** screen provides:
- **Visual Timeline** - Color-coded bars showing sleep (blue) and feed (green) periods throughout the day
- **Date Navigation** - Navigate between days with ← → buttons
- **Daily Statistics**:
  - Total sleep duration
  - Total feeding duration
  - Diaper change count
  - Total events count
- **Event List** - Chronological list of all events for the selected day
- **Interactive Timeline** - Tap on the timeline to see what was happening at specific times

### Milestones View

- **Grid Layout** - Milestones displayed in an easy-to-browse grid
- **Add Milestone** - Tap the ➕ button to add a new milestone
- **Filtered View** - Shows only events marked as "Milestone" type

### Owlet Monitor View

**Real-Time Monitoring:**
- Latest heart rate, oxygen level, and movement
- Sock connection status and battery level
- Alert indicators (low oxygen, high heart rate, low battery)
- Auto-refreshes every 5 seconds

**Historical Charts:**
- Tap **📊** button to view historical data
- Navigate between days with date navigation
- View heart rate and oxygen level trends
- See hourly aggregated data

### View Events History

1. Tap **"View Events"** (if available) or navigate through timeline view
2. Scroll through chronological list (most recent first)
3. See all event details including time, type, and notes
4. Tap **"←"** to go back

## API

Base URL: `/events.php`

### Endpoints

#### GET `/events.php`
Returns an array of events (most recent first).

**Query Parameters:**
- `latest=true` - Returns latest Owlet vital reading
- `vitals=true` - Returns today's minute-by-minute vital data
- `todays_hourly=true` - Returns today's hourly aggregated data
- `summaries=true` - Returns daily summaries for past 30 days

#### POST `/events.php`
Creates a new event or updates an existing event by `id`.

**Headers:**
- `Content-Type: application/json`

**Body Fields:**
- `id` (required) - Unique event identifier (timestamp recommended)
- `type` (required) - Event type (e.g., "Feed Start", "Sleep End", "Diaper", "Milestone")
- `icon` (required) - Emoji icon for the event
- `time` (required) - ISO 8601 timestamp (e.g., "2025-10-13T07:45:00.000Z")
- `notes` (optional) - Additional notes or details
- `meta` (optional) - Any JSON object for additional metadata

#### DELETE `/events.php`
Deletes an event by `id`.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{ "id": "<event-id>" }
```

### Example Event Object

```json
{
  "id": "1697222400000",
  "type": "Feed Start",
  "icon": "🍼",
  "time": "2025-10-13T07:45:00.000Z",
  "notes": "120ml bottle",
  "meta": {
    "amountMl": 120,
    "method": "bottle"
  }
}
```

### cURL Examples

```bash
# List all events
curl http://localhost:8000/events.php

# Get latest Owlet vital reading
curl http://localhost:8000/events.php?latest=true

# Add/update event
curl -X POST http://localhost:8000/events.php \
  -H "Content-Type: application/json" \
  -d '{
    "id":"1697222400000",
    "type":"Sleep Start",
    "icon":"😴",
    "time":"2025-10-13T02:10:00.000Z",
    "notes":"night sleep"
  }'

# Delete event
curl -X DELETE http://localhost:8000/events.php \
  -H "Content-Type: application/json" \
  -d '{"id":"1697222400000"}'
```

## Owlet Smart Sock Integration (Optional)

### Installation

1. **Install Python dependencies:**

```bash
# Windows
pip install -r requirements.txt

# Linux/Mac
pip3 install -r requirements.txt
```

2. **Configure Owlet credentials in `owlet_config.json`:**

```json
{
  "email": "your-owlet-email@example.com",
  "password": "your-owlet-password",
  "region": "us-east-1",
  "sync_interval_minutes": 15,
  "retention_hours": 48,
  "auto_create_events": true,
  "php_api_endpoint": "http://localhost:8000/events.php"
}
```

### Configuration Options

- **email** - Your Owlet account email
- **password** - Your Owlet account password
- **region** - Server region (`us-east-1`, `eu-west-1`, etc.)
- **sync_interval_minutes** - How often to fetch data (default: 15 minutes)
- **retention_hours** - How long to keep vital history (default: 48 hours)
- **auto_create_events** - Auto-create Sleep Start/End events based on movement patterns (true/false)
- **php_api_endpoint** - URL to your Baby Monitor API endpoint

### Starting the Service

**Windows:**
```bash
start_owlet_service.bat
```

**Linux/Mac:**
```bash
chmod +x start_owlet_service.sh
./start_owlet_service.sh
```

**Or run directly:**
```bash
python3 owlet_sync.py
```

### Running as Background Service

**Windows (Task Scheduler):**
1. Open Task Scheduler (Win + R, type `taskschd.msc`)
2. Create Basic Task
3. Set trigger to run at startup
4. Set action to run: `C:\Projects\BabyMonitor\start_owlet_service.bat`

**Linux (systemd):**
Create `/etc/systemd/system/owlet-sync.service`:

```ini
[Unit]
Description=Owlet Sync Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/BabyMonitor
ExecStart=/usr/bin/python3 /var/www/BabyMonitor/owlet_sync.py
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable owlet-sync
sudo systemctl start owlet-sync
```

### Monitoring Service Activity

Check `owlet_sync.log` for activity:

```bash
# Windows
type owlet_sync.log

# Linux/Mac
tail -f owlet_sync.log
```

### Data Structure

Owlet vital data is stored in multiple files for efficient access:

- **`owlet_latest.json`** — Latest real-time vital reading (single entry, updated continuously)
- **`owlet_minutes/`** — Daily minute-by-minute data files (one file per day: `owlet_minutes_YYYY-MM-DD.json`)
- **`owlet_todays_hourly.json`** — Today's hourly aggregated data (accumulates throughout the day)
- **`owlet_daily_summaries/`** — Daily summary files with hourly granularity (one file per day: `owlet_summary_YYYY-MM-DD.json`)

**Example vital reading structure:**

```json
{
  "timestamp": "2025-11-17T14:30:00Z",
  "heart_rate": 125,
  "oxygen_level": 98,
  "movement": 5,
  "battery": 85,
  "sock_connected": true,
  "low_battery": false,
  "high_heart_rate": false,
  "low_oxygen": false
}
```

### API Endpoints for Vital Data

**Get latest vital reading:**
```
GET http://localhost:8000/events.php?latest=true
```
Returns the latest real-time vital reading from `owlet_latest.json`.

**Get today's minute-by-minute data:**
```
GET http://localhost:8000/events.php?vitals=true
```
Returns today's minute-by-minute vital data from `owlet_minutes/` directory and the latest reading.

**Get today's hourly aggregated data:**
```
GET http://localhost:8000/events.php?todays_hourly=true
```
Returns today's hourly aggregated data from `owlet_todays_hourly.json` (accumulates throughout the day).

**Get daily summaries:**
```
GET http://localhost:8000/events.php?summaries=true
```
Returns daily summaries for the past 30 days with hourly granularity from `owlet_daily_summaries/` directory, including today's in-progress hourly data.

### Troubleshooting

**"No Owlet Data Available" message:**
1. Verify `owlet_config.json` has correct credentials
2. Check service is running (look for console window or check `owlet_sync.log`)
3. Ensure PHP endpoint URL is correct
4. Check network connectivity

**"Authentication failed" error:**
1. Verify email and password are correct
2. Try logging into the official Owlet app to confirm credentials work
3. Check the `region` setting matches your account
4. Owlet may have rate limits - wait a few minutes and restart

**Sync not completing:**
1. Check internet connectivity on the server
2. Verify `php_api_endpoint` URL is accessible
3. Check recent `owlet_sync.log` entries for errors

**Sleep events not being created:**
1. Ensure `auto_create_events` is set to `true`
2. Check baby is wearing the Owlet sock
3. Review `owlet_sync.log` for detection details

**Vital data not updating:**
1. Verify Owlet sock is connected and charging
2. Check `owlet_latest.json` to confirm data is being received
3. Check `owlet_minutes/` directory for daily data files
4. Ensure sync interval is reasonable (not too short)
5. Check PHP file permissions for writing to data files

## Daily Backup (Production)

The app includes a PHP script for backing up events to a database. This provides an additional layer of data protection beyond the JSON file storage.

### Database Backup Script

**File:** `backup_events_to_db.php`

This script reads `events.json` and backs up all events to a MySQL/MariaDB database table.

### Database Setup

Create a database table:

```sql
CREATE TABLE events_backups (
    event_id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    event_time DATETIME NOT NULL,
    notes TEXT,
    backup_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_time (event_time),
    INDEX idx_backup_date (backup_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Configuration

Edit database connection settings in `backup_events_to_db.php` or set environment variables:
- `DB_HOST` - Database host (default: localhost)
- `DB_NAME` - Database name (default: baby_monitor)
- `DB_USER` - Database user (default: root)
- `DB_PASS` - Database password (default: empty)

### Running the Backup

**Manual execution:**
```bash
php backup_events_to_db.php
```

**Linux/Mac - Daily cron job (runs at 2 AM):**
```bash
crontab -e
```

Add this line:
```bash
0 2 * * * /usr/bin/php /path/to/BabyMonitor/backup_events_to_db.php >> /path/to/BabyMonitor/backup_events.log 2>&1
```

**Windows - Task Scheduler:**
1. Open Task Scheduler (Win + R, type `taskschd.msc`)
2. Create Basic Task
3. Name: "Baby Monitor Events Backup"
4. Trigger: Daily at 2:00 AM
5. Action: Start a program
6. Program: `php`
7. Arguments: `C:\Projects\BabyMonitor\backup_events_to_db.php`
8. Start in: `C:\Projects\BabyMonitor`

### Backup Logs

Check `backup_events.log` for backup activity and any errors.

## File Structure

### Core Application Files
- `index.html` — UI, interactions, and layout
- `app.js` — Frontend JavaScript logic (event handling, views, API calls)
- `styles.css` — Application styles
- `events.php` — JSON CRUD API (GET, POST, DELETE) with CORS enabled
- `events.json` — Persisted baby events (JSON array)
- `manifest.json` — PWA metadata and configuration
- Icons — Apple touch icons and PWA icons (`apple-touch-icon.png`, `icon-512.png`, etc.)

### Owlet Integration Files
- `owlet_sync.py` — Python service for Owlet integration
- `owlet_config.json` — Owlet credentials and configuration (⚠️ contains sensitive data)
- `owlet_latest.json` — Latest real-time vital reading (single entry, auto-updated)
- `owlet_todays_hourly.json` — Today's hourly aggregated data
- `owlet_minutes/` — Daily minute-by-minute data files (`owlet_minutes_YYYY-MM-DD.json`)
- `owlet_daily_summaries/` — Daily summary files with hourly granularity (`owlet_summary_YYYY-MM-DD.json`)
- `owlet_sync.log` — Service activity log
- `requirements.txt` — Python dependencies for Owlet integration
- `start_owlet_service.bat` / `start_owlet_service.sh` — Service startup scripts

### Backup Files
- `backup_events_to_db.php` — Database backup script

### Utility Scripts
- `generate_owlet_dummy_data.py` — Generate test data for Owlet features
- `generate_summaries.py` — Generate daily summaries from minute data

## App Features

### Disabled (For App-Like Experience)

✅ **Zoom disabled** - No pinch-to-zoom  
✅ **Scroll disabled** - Fixed layout (except in specific views)  
✅ **Text selection disabled** - No accidental selections  
✅ **Double-tap zoom disabled**  
✅ **Pull-to-refresh disabled**  
✅ **Safari UI hidden** - Full-screen standalone mode  

### Enabled

✅ **Modal scrolling** - Scroll inside forms  
✅ **Events list scrolling** - Scroll through history  
✅ **Timeline scrolling** - Scroll through day timeline  
✅ **Input fields** - Text selection in forms  
✅ **Auto-refresh** - Owlet data refreshes every 5 seconds (main view) and 10 seconds (history view)  
✅ **Smooth animations** - Slide-in animations for new data  

## Security Notes

⚠️ **Important Security Considerations:**

- This is intentionally simple and local‑first
- **Do not expose publicly** without adding authentication and validation
- CORS is open (`Access-Control-Allow-Origin: *`) for local/mobile testing - restrict in production
- Owlet integration uses unofficial `pyowletapi` library - respect Owlet's terms of service
- Store `owlet_config.json` securely (contains credentials)
- **Don't commit credentials to version control** - add `owlet_config.json` to `.gitignore`
- Consider adding authentication if deploying to a public server
- Validate and sanitize all user inputs in production

## Roadmap (Nice-to-Have)

- 📊 Export functionality (CSV, JSON)
- 📈 Simple statistics dashboard (sleep durations, feeding counts, trends)
- 🔄 Optional multi‑device sync with a real backend
- 📅 Weekly/monthly data aggregates
- 📉 Graphical trend analysis
- 🚨 Alert pattern detection
- 🔔 Push notifications for important events
- 👥 Multi-baby support
- 📱 Better Android PWA support
- 🌙 Dark mode

## License

This project is provided as-is for personal use. Use at your own risk.

## Contributing

This is a personal project, but suggestions and improvements are welcome. Please ensure any changes maintain the simplicity and mobile-first approach of the app.
