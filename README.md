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
- ✅ **Long Feed Alerts** - PWA notifications when a feeding session exceeds 1 hour
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

- **PHP 8.0+** - [Download PHP](https://www.php.net/downloads) or use a package manager
- **(Optional) Python 3.7+** - For Owlet Smart Sock integration
- **Modern browser** - Chrome, Safari, Firefox, Edge (for PWA support)

### Local Setup & Running

#### Windows

1. **Clone or download the project:**
   ```bash
   git clone <repository-url> C:\Projects\BabyMonitor
   cd C:\Projects\BabyMonitor
   ```

2. **Verify PHP is installed:**
   ```bash
   php -v
   ```
   If not found, [download PHP](https://www.php.net/downloads) and add it to your PATH.

3. **Start the development server:**
   ```bash
   php -S localhost:8000
   ```
   Or to access from other devices on your network:
   ```bash
   php -S 0.0.0.0:8000
   ```

4. **Open in your browser:**
   - Local access: `http://localhost:8000`
   - Network access: `http://<your-ip>:8000` (e.g., `http://192.168.1.100:8000`)

#### Linux/Mac

1. **Clone or download the project:**
   ```bash
   git clone <repository-url> ~/BabyMonitor
   cd ~/BabyMonitor
   ```

2. **Verify PHP is installed:**
   ```bash
   php -v
   ```
   If not found, install via your package manager:
   ```bash
   # macOS (Homebrew)
   brew install php
   
   # Ubuntu/Debian
   sudo apt update && sudo apt install php
   
   # CentOS/RHEL
   sudo yum install php
   ```

3. **Start the development server:**
   ```bash
   php -S localhost:8000
   ```
   Or to access from other devices:
   ```bash
   php -S 0.0.0.0:8000
   ```

4. **Open in your browser:**
   - Local access: `http://localhost:8000`
   - Network access: `http://<your-ip>:8000`

#### Keeping the Server Running

**Option 1: Terminal/Console (Basic)**
- Keep the terminal window open while using the app
- Press `Ctrl+C` to stop the server

**Option 2: Background Service (Recommended)**
- **Windows:** Use `start_owlet_service.bat` or Task Scheduler
- **Linux/Mac:** Use systemd or `nohup` to keep it running in the background

```bash
# Linux/Mac - Run in background
nohup php -S 0.0.0.0:8000 > server.log 2>&1 &
```

### Accessing on Mobile Devices

#### Finding Your Computer's IP Address

**Windows:**
```bash
# Open Command Prompt and run:
ipconfig

# Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)
```

**Linux/Mac:**
```bash
# Option 1
ifconfig

# Option 2
ip addr

# Look for your WiFi adapter's IP address (usually starts with 192.168.x.x)
```

#### iOS (iPhone/iPad)

1. **Ensure your iPhone is on the same WiFi network as your computer**

2. **Open Safari and navigate to:**
   ```
   http://<YOUR-COMPUTER-IP>:8000
   ```
   Example: `http://192.168.1.100:8000`

3. **Install as PWA (Add to Home Screen):**
   - Tap the **Share** button (square with arrow ⬆)
   - Scroll down and tap **"Add to Home Screen"**
   - Name it `Baby Monitor`
   - Tap **"Add"**
   - The app icon appears on your home screen
   - Tap it to launch in full-screen standalone mode (no Safari UI)

4. **Using the App:**
   - Tap the icon to open in full-screen mode
   - Works offline for basic event tracking
   - Requires WiFi/network for Owlet vital monitoring

#### Android (Chrome)

1. **Ensure your Android device is on the same WiFi network**

2. **Open Chrome and navigate to:**
   ```
   http://<YOUR-COMPUTER-IP>:8000
   ```

3. **Install as PWA (Add to Home Screen):**
   - Tap the **menu** (⋮ three dots) in the top-right
   - Tap **"Add to Home screen"**
   - Confirm the app name
   - The app installs and appears on your home screen
   - Tap it to launch in standalone mode

#### Desktop/Laptop

- Simply open `http://localhost:8000` in your browser
- Works best in Chrome, Safari, Firefox, or Edge
- Can be added to home screen on desktop browsers (some versions)

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

### Quick Start - Owlet Setup

1. **Ensure Python 3.7+ is installed:**
   ```bash
   # Check if Python is installed
   python --version
   # or
   python3 --version
   ```

2. **Install Python dependencies:**
   ```bash
   # Windows
   pip install -r requirements.txt
   
   # Linux/Mac
   pip3 install -r requirements.txt
   ```
   
   This installs: `pyowletapi`, `requests`, and other required packages

3. **Configure Owlet credentials in `owlet_config.json`:**

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

#### Quick Start (Development)

**Windows (Command Prompt or PowerShell):**
```bash
# From the project root directory
python owlet_sync.py
```

**Linux/Mac (Terminal):**
```bash
# From the project root directory
python3 owlet_sync.py
```

Keep this terminal window open while using the app. You'll see sync status messages in the console.

#### Using Startup Scripts

**Windows:**
```bash
# Double-click this file or run:
start_owlet_service.bat
```

**Linux/Mac:**
```bash
# Make the script executable
chmod +x start_owlet_service.sh

# Run it
./start_owlet_service.sh
```

### Running as Background Service (Production)

#### Windows - Task Scheduler

1. **Open Task Scheduler:**
   - Press `Win + R`, type `taskschd.msc`, press Enter
   - Or search for "Task Scheduler" in the Start menu

2. **Create a new task:**
   - Right-click **Task Scheduler Library** → **Create Basic Task**
   - **Name:** `Baby Monitor Owlet Sync`
   - **Description:** `Keep Owlet vital data in sync`

3. **Set the trigger:**
   - **Trigger:** At Startup
   - Click **Next**

4. **Set the action:**
   - **Action:** Start a program
   - **Program/script:** `C:\Projects\BabyMonitor\start_owlet_service.bat`
   - **Start in:** `C:\Projects\BabyMonitor`
   - Click **Next** → **Finish**

5. **Test it:**
   - Right-click the task → **Run**
   - Verify the Owlet data starts syncing (check `owlet_sync.log`)

#### Linux/Mac - systemd Service

1. **Create the service file:**
   ```bash
   sudo nano /etc/systemd/system/owlet-sync.service
   ```

2. **Paste this content (adjust paths as needed):**
   ```ini
   [Unit]
   Description=Baby Monitor Owlet Sync Service
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/BabyMonitor
   ExecStart=/usr/bin/python3 /path/to/BabyMonitor/owlet_sync.py
   Restart=always
   RestartSec=30
   StandardOutput=append:/path/to/BabyMonitor/owlet_sync.log
   StandardError=append:/path/to/BabyMonitor/owlet_sync.log
   
   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable owlet-sync
   sudo systemctl start owlet-sync
   ```

4. **Check service status:**
   ```bash
   sudo systemctl status owlet-sync
   
   # View logs
   sudo journalctl -u owlet-sync -f
   ```

### Monitoring Service Activity

#### Check the Log File

**Windows (Command Prompt):**
```bash
# View the entire log
type owlet_sync.log

# View last 20 lines
powershell -Command "Get-Content owlet_sync.log -Tail 20"

# Follow log in real-time
powershell -Command "Get-Content owlet_sync.log -Tail 20 -Wait"
```

**Linux/Mac (Terminal):**
```bash
# View the entire log
cat owlet_sync.log

# View last 20 lines
tail -20 owlet_sync.log

# Follow log in real-time (Ctrl+C to stop)
tail -f owlet_sync.log
```

#### What to Look For in the Log

- ✅ `Owlet sync started` - Service is running
- ✅ `Successfully fetched vital data` - Data is syncing
- ✅ `Updated owlet_latest.json` - Latest readings stored
- ⚠️ `Authentication failed` - Check credentials in `owlet_config.json`
- ⚠️ `Connection error` - Check network connectivity
- ✅ `Completed in X seconds` - Sync timing information

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

### Troubleshooting Owlet Integration

#### "No Owlet Data Available" Message

**Quick checks:**
1. ✓ Verify the Owlet service is running
   - Check if the terminal/console window is still open
   - Check `owlet_sync.log` for errors
   
2. ✓ Verify `owlet_config.json` has correct credentials:
   ```bash
   # Windows/Linux/Mac - View the file
   cat owlet_config.json  # Linux/Mac
   type owlet_config.json  # Windows
   ```
   
3. ✓ Check network connectivity:
   ```bash
   ping owlet.com
   ```

4. ✓ Verify PHP endpoint is reachable:
   ```bash
   curl http://localhost:8000/events.php
   ```

5. **Solution:** Restart both the PHP server and Owlet sync service

#### "Authentication Failed" Error

**Check credentials:**
1. Verify email and password are correct in `owlet_config.json`
2. Test logging into the official Owlet mobile app with the same credentials
3. Verify the `region` matches your account:
   - `us-east-1` for USA
   - `eu-west-1` for Europe
   - Check other available regions in the Owlet app settings

4. **Rate limiting:** Owlet may block repeated failed attempts
   - Wait 30 minutes before retrying
   - Restart the service with correct credentials

#### Sync Not Completing

**Diagnostics:**
1. Check internet connectivity:
   ```bash
   ping google.com
   ```

2. Verify PHP endpoint is working:
   ```bash
   curl http://localhost:8000/events.php?latest=true
   ```

3. Check file permissions (Linux/Mac):
   ```bash
   ls -la owlet_latest.json
   chmod 644 owlet_latest.json  # Make readable/writable
   ```

4. Review the log for specific errors:
   ```bash
   tail -50 owlet_sync.log  # View last 50 lines
   ```

#### Sleep Events Not Being Created

**Check configuration:**
1. Verify `auto_create_events` is `true` in `owlet_config.json`
2. Ensure baby is wearing the Owlet sock
3. Check if movement data is being received:
   ```bash
   # View latest data
   cat owlet_latest.json
   ```
4. Review detection parameters in `owlet_sync.log`

#### Vital Data Not Updating

**Verification steps:**
1. **Owlet sock status:**
   - Verify sock is connected to Owlet account
   - Check sock is charged (battery level visible in app)
   - Check baby is wearing the sock

2. **Data files:**
   ```bash
   # Check if data is being created
   ls -la owlet_latest.json
   cat owlet_latest.json
   
   # Check minute-by-minute data
   ls -la owlet_minutes/
   cat owlet_minutes/owlet_minutes_2025-11-20.json  # Today's file
   ```

3. **Sync interval:**
   - Ensure `sync_interval_minutes` is set to a reasonable value (15 min recommended)
   - Not too short (avoid rate limiting) or too long (stale data)

4. **Permissions:**
   ```bash
   # Linux/Mac - ensure write permissions
   chmod -R 755 owlet_minutes/
   chmod -R 755 owlet_daily_summaries/
   ```

5. **Last resort:** Restart both services
   ```bash
   # Stop PHP server (Ctrl+C in terminal)
   # Stop Owlet sync (Ctrl+C in terminal)
   
   # Restart PHP server
   php -S localhost:8000
   
   # Restart Owlet sync
   python3 owlet_sync.py
   ```

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

### Long Feed Notifications (PWA)

The app includes automatic notifications to alert you when a feeding session has lasted longer than 1 hour without an end event.

#### How It Works

1. **Automatic Permission Request** - On first load, the app requests notification permissions from your device
2. **Background Monitoring** - After you grant permission, the app continuously monitors for active feeds
3. **Smart Alerting** - When a "Feed Start" event has been active for more than 1 hour without a corresponding "Feed End", you'll receive a notification
4. **Checks Every 5 Minutes** - The app checks feed duration every 5 minutes to minimize performance impact
5. **One Notification Per Feed** - Only one notification per feed session, even if the feed continues beyond the threshold

#### Notification Features

- **Clear Alert** - Shows how long the feeding session has been active
- **Interactive Actions** - Tap to open the app and view the timeline
- **iPhone Support** - Notifications work when the PWA is added to home screen or running in Safari
- **Service Worker Integration** - Uses PWA service worker for reliable background notifications

#### Enabling Notifications

- **First Load**: Allow notification permission when prompted
- **Already Denied?**: You can re-enable notifications in:
  - **iOS**: Settings > Safari > Notifications (for PWA)
  - **Android**: Settings > Notifications > Baby Monitor

## Security Notes

⚠️ **Important Security Considerations:**

### Local Use (Recommended)

- ✅ This is intentionally simple and designed for **local/home network use only**
- ✅ Safe for use on a private home WiFi network
- ✅ No internet connection required for basic event tracking
- ✅ Data stays on your local device/server

### Production/Public Deployment

**Do NOT expose this app publicly without security measures:**

- ❌ **Do not expose publicly** without adding authentication and validation
- ❌ **Never deploy on the internet** without implementing:
  - User authentication (login/password)
  - HTTPS/SSL encryption
  - Input validation and sanitization
  - Rate limiting

- ⚠️ **CORS Security:**
  - Currently open (`Access-Control-Allow-Origin: *`) for local testing
  - Restrict in production to specific domains only

- ⚠️ **Owlet Integration:**
  - Uses unofficial `pyowletapi` library - respect Owlet's terms of service
  - Your credentials are stored in `owlet_config.json`
  - **Never commit credentials to version control**

### Protecting Your Data

1. **Secure `owlet_config.json`:**
   ```bash
   # Hide from version control
   echo "owlet_config.json" >> .gitignore
   
   # Linux/Mac - Restrict file permissions
   chmod 600 owlet_config.json
   ```

2. **Regular backups:**
   - Backup `events.json` regularly
   - Use the database backup feature (optional)
   - Store backups securely

3. **Network security:**
   - Only use on trusted home WiFi networks
   - Disable server when not in use
   - Change default port if needed

## Getting Help

### Common Issues

**Server won't start:**
- Check if port 8000 is already in use: `netstat -an | findstr :8000` (Windows) or `lsof -i :8000` (Mac)
- Try a different port: `php -S localhost:8001`

**Can't access from mobile:**
- Verify both devices are on the same WiFi network
- Use your computer's IP address, not `localhost`
- Check firewall isn't blocking port 8000

**Data not showing:**
- Refresh the page (pull down on iOS PWA)
- Clear browser cache
- Check `events.json` exists in the project root

**Still stuck?**
- Check the browser console for errors (F12 → Console tab)
- Review `owlet_sync.log` for Owlet-specific issues
- Search GitHub issues or create a new one

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
