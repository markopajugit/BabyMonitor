# Baby Monitor

Simple, mobile‑first web app to quickly log baby events (feed, sleep, diaper, doctor, milestones, notes) with optional Owlet Smart Sock integration for real‑time vital monitoring.

## Overview

The app is designed to be added to an iOS home screen and used like a lightweight native app. UI is intentionally minimal and touch‑first: large tiles on a grid for one‑tap actions and a simple list to review history.

## Tech Stack

- **Frontend:** `index.html` (HTML/CSS/vanilla JS), PWA manifest and icons
- **Backend:** `events.php` (single PHP file)
- **Storage:** `events.json` (flat JSON file on disk)
- **Optional:** `owlet_sync.py` (Python service for Owlet Smart Sock data)

No database, no auth, just simple CRUD via PHP.

## Quick Start

### Prerequisites

- PHP 8+ in your PATH
- (Optional) Python 3.7+ for Owlet integration

### Running the Server

From the project root:

```bash
php -S 0.0.0.0:8000 -t C:\Projects\BabyMonitor
```

Then open `http://localhost:8000` on your computer.

### Using on iPhone

1. Find your computer's IP address:
   - Open Command Prompt (Windows Key + R, type `cmd`)
   - Run: `ipconfig`
   - Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)

2. On your iPhone Safari, navigate to:
   - `http://YOUR-IP-ADDRESS:8000` (e.g., `http://192.168.1.100:8000`)
   - **Make sure your iPhone and computer are on the same WiFi network!**

3. Add to Home Screen:
   - Tap the **Share** button (square with arrow pointing up)
   - Scroll down and tap **"Add to Home Screen"**
   - Name it "Baby Monitor"
   - Tap **"Add"**
   - The app will appear on your home screen with the diaper icon
   - Tap it to launch in full-screen mode (no Safari UI)

## Using the App

### Quick Events (One-Tap)

- **Feed**: Tap to log feeding instantly
- **Sleep**: Tap to log sleep instantly
- **Diaper**: Tap to log diaper change instantly

### Custom Events

1. Tap **"Add Event"**
2. Select event type
3. Time is pre-filled with current time
4. Add optional notes
5. Tap **"Save Event"**

### View History

1. Tap **"View Events"**
2. Scroll through chronological list
3. See all details
4. Tap **"←"** to go back

## API

Base URL: `/events.php`

### Endpoints

- **GET** `/events.php`
  - Returns an array of events (most recent first)

- **POST** `/events.php`
  - Content‑Type: `application/json`
  - Body fields (required): `id`, `type`, `icon`, `time`
  - Optional fields: `notes`, `meta` (any JSON object)
  - Creates a new event or updates an existing event by `id`

- **DELETE** `/events.php`
  - Content‑Type: `application/json`
  - Body: `{ "id": "<event-id>" }`

### Example Event Object

```json
{
  "id": "1697222400000",
  "type": "feed",
  "icon": "🍼",
  "time": "2025-10-13T07:45:00.000Z",
  "notes": "120ml bottle",
  "meta": { "amountMl": 120 }
}
```

### cURL Examples

```bash
# List events
curl http://localhost:8000/events.php

# Add/update event
curl -X POST http://localhost:8000/events.php \
  -H "Content-Type: application/json" \
  -d '{
    "id":"1697222400000",
    "type":"sleep",
    "icon":"😴",
    "time":"2025-10-13T02:10:00.000Z",
    "notes":"nap"
  }'

# Delete event
curl -X DELETE http://localhost:8000/events.php \
  -H "Content-Type: application/json" \
  -d '{"id":"1697222400000"}'
```

## Owlet Smart Sock Integration (Optional)

### Installation

1. Install Python dependencies:

```bash
# Windows
pip install -r requirements.txt

# Linux/Mac
pip3 install -r requirements.txt
```

2. Configure Owlet credentials in `owlet_config.json`:

```json
{
  "email": "your-owlet-email@example.com",
  "password": "your-owlet-password",
  "region": "us-east-1",
  "sync_interval_minutes": 15,
  "retention_hours": 48,
  "auto_create_events": true,
  "php_api_endpoint": "http://localhost/events.php"
}
```

### Configuration Options

- **email**: Your Owlet account email
- **password**: Your Owlet account password
- **region**: Server region (`us-east-1`, `eu-west-1`, etc.)
- **sync_interval_minutes**: How often to fetch data (default: 15 minutes)
- **retention_hours**: How long to keep vital history (default: 48 hours)
- **auto_create_events**: Auto-create Sleep Start/End events (true/false)
- **php_api_endpoint**: URL to your Baby Monitor API

### Starting the Service

```bash
# Windows
start_owlet_service.bat

# Linux/Mac
chmod +x start_owlet_service.sh
./start_owlet_service.sh
```

Or run directly:

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

Check `owlet_sync.log` for:

```bash
# Windows
type owlet_sync.log

# Linux/Mac
tail -f owlet_sync.log
```

### Data Structure

Owlet vital data is stored in `owlet_vitals.json`:

```json
[
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
]
```

### API Endpoints for Vital Data

```
GET http://localhost/events.php?latest=true
```
Returns the latest vital reading.

```
GET http://localhost/events.php?vitals=true
```
Returns today's minute-by-minute vital data and analysis.

```
GET http://localhost/events.php?summaries=true
```
Returns daily summaries for the past 30 days with hourly granularity.

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
2. Check `owlet_vitals.json` to confirm data is being received
3. Ensure sync interval is reasonable (not too short)
4. Check PHP file permissions for writing to data files

## Files Structure

- `index.html` — UI, interactions, and layout
- `events.php` — JSON CRUD (GET, POST, DELETE) with CORS enabled
- `events.json` — persisted events
- `owlet_sync.py` — Python service for Owlet integration
- `owlet_config.json` — Owlet credentials and configuration
- `owlet_vitals.json` — Real-time and historical Owlet vital data
- `owlet_latest.json` — Latest vital reading (for real-time display)
- `owlet_history.json` — Minute-interval historical vital data
- `owlet_daily_summaries/` — Daily summary files (hourly aggregates)
- `manifest.json` — PWA metadata
- Icons — Apple touch icons and PWA icons
- `requirements.txt` — Python dependencies for Owlet integration

## App Features

### Disabled (For App-Like Experience)

✅ Zoom disabled - No pinch-to-zoom  
✅ Scroll disabled - Fixed layout  
✅ Text selection disabled - No accidental selections  
✅ Double-tap zoom disabled  
✅ Pull-to-refresh disabled  
✅ Safari UI hidden - Full-screen standalone mode  

### Enabled

✅ Modal scrolling - Scroll inside forms  
✅ Events list scrolling - Scroll through history  
✅ Input fields - Text selection in forms  

## Notes

- This is intentionally simple and local‑first
- Do not expose publicly without adding authentication and validation
- CORS is open (`Access-Control-Allow-Origin: *`) for local/mobile testing
- Owlet integration uses unofficial `pyowletapi` library - respect Owlet's terms of service
- Store `owlet_config.json` securely (contains credentials)
- Don't commit credentials to version control

## Roadmap (Nice-to-Have)

- Export (CSV)
- Simple stats (sleep durations, feeding counts)
- Optional multi‑device sync with a real backend
- Weekly/monthly data aggregates
- Graphical trend analysis
- Alert pattern detection
