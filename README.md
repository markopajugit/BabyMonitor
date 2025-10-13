# Baby Monitor

Simple, mobile‑first web app to quickly log baby events (feed, sleep, diaper, doctor, milestones, notes).

## Overview
The app is designed to be added to an iOS home screen and used like a lightweight native app. UI is intentionally minimal and touch‑first: large tiles on a grid for one‑tap actions and a simple list to review history.

## Tech Stack
- Frontend: `index.html` (HTML/CSS/vanilla JS), PWA manifest and icons
- Backend: `events.php` (single PHP file)
- Storage: `events.json` (flat JSON file on disk)

No database, no auth, just simple CRUD via PHP.

## Quick Start (Windows / PHP built‑in server)
Prerequisite: PHP 8+ in your PATH.

From the project root:

```bash
php -S 0.0.0.0:8000 -t C:\Projects\BabyMonitor
```

Then open `http://localhost:8000` on your computer.

To use on your iPhone (same Wi‑Fi): open `http://YOUR-LAN-IP:8000` in Safari, then add to Home Screen. See `SETUP.md` for detailed iOS steps and troubleshooting.

## Using the App
- Add Event: open the modal, pick a type, optional notes, time defaults to now
- Quick Actions: one‑tap Feed, Sleep, Diaper
- View Events: browse chronological list and delete if needed

Data is persisted to `events.json` by the backend.

## API
Base URL: `/events.php`

- GET `/events.php`
  - Returns an array of events (most recent first)

- POST `/events.php`
  - Content‑Type: `application/json`
  - Body fields (required): `id`, `type`, `icon`, `time`
  - Optional fields: `notes`, `meta` (any JSON object)
  - Creates a new event at the beginning of the list or updates an existing event by `id`

- DELETE `/events.php`
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

## Files of Interest
- `index.html` — UI, interactions, and layout
- `events.php` — JSON CRUD (GET, POST, DELETE) with CORS enabled
- `events.json` — persisted events
- `manifest.json` and icons — PWA metadata and app icons
- `SETUP.md` — iOS Home Screen install guide and troubleshooting

## Notes
- This is intentionally simple and local‑first. Do not expose publicly without adding authentication and validation.
- CORS is open (`Access-Control-Allow-Origin: *`) to make local/mobile testing easy.

## Roadmap (nice‑to‑have)
- Export (CSV)
- Simple stats (sleep durations, feeding counts)
- Optional multi‑device sync with a real backend

