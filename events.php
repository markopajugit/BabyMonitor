<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Set timezone to Europe/Tallinn
date_default_timezone_set('Europe/Tallinn');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$eventsFile = 'events.json';

// Function to read events from file
function getEvents($file) {
    if (!file_exists($file)) {
        return [];
    }
    
    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        return [];
    }
    
    $events = json_decode($jsonData, true);
    return $events === null ? [] : $events;
}

// Function to save events to file
function saveEvents($file, $events) {
    $jsonData = json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($file, $jsonData, LOCK_EX) !== false;
}

// Function to get available daily summaries
function getDailySummaries($summariesDir = 'owlet_daily_summaries', $limit = 30) {
    $summaries = [];
    
    if (!is_dir($summariesDir)) {
        return $summaries;
    }
    
    $files = array_diff(scandir($summariesDir, SCANDIR_SORT_DESCENDING), ['.', '..']);
    $count = 0;
    
    foreach ($files as $file) {
        if (substr($file, -5) === '.json' && $count < $limit) {
            try {
                $filepath = $summariesDir . '/' . $file;
                $data = json_decode(file_get_contents($filepath), true);
                if ($data && isset($data['date'])) {
                    $summaries[] = $data;
                    $count++;
                }
            } catch (Exception $e) {
                // Skip invalid files
            }
        }
    }
    
    return $summaries;
}

// Function to get today's hourly data
function getTodaysHourly($filename = 'owlet_todays_hourly.json') {
    if (!file_exists($filename)) {
        return [
            'date' => date('Y-m-d', time()),
            'hourly' => [],
            'total_hours' => 0,
            'last_update' => null
        ];
    }
    
    try {
        $data = json_decode(file_get_contents($filename), true);
        if ($data === null) {
            return [
                'date' => date('Y-m-d', time()),
                'hourly' => [],
                'total_hours' => 0,
                'last_update' => null
            ];
        }
        return $data;
    } catch (Exception $e) {
        return [
            'date' => date('Y-m-d', time()),
            'hourly' => [],
            'total_hours' => 0,
            'last_update' => null
        ];
    }
}

// Handle GET request - return all events or vitals
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if requesting today's hourly data
    if (isset($_GET['todays_hourly']) && $_GET['todays_hourly'] === 'true') {
        $todaysHourly = getTodaysHourly('owlet_todays_hourly.json');
        echo json_encode($todaysHourly);
        exit();
    }
    
    // Check if requesting daily summaries
    if (isset($_GET['summaries']) && $_GET['summaries'] === 'true') {
        // Return daily summary data for fast historical loading
        $summaries = getDailySummaries('owlet_daily_summaries', 30); // Get last 30 days
        
        // Include today's hourly data (in-progress day not yet finalized into summary)
        $todaysHourly = getTodaysHourly('owlet_todays_hourly.json');
        
        // Prepend today's data if it has readings
        if (!empty($todaysHourly['hourly'])) {
            array_unshift($summaries, $todaysHourly);
        }
        
        $response = [
            'summaries' => $summaries,
            'total_days' => count($summaries),
            'last_update' => !empty($summaries) ? $summaries[0]['last_update'] ?? $summaries[0]['last_timestamp'] ?? null : null
        ];
        echo json_encode($response);
        exit();
    }
    
    // Check if requesting vitals data
    if (isset($_GET['vitals']) && $_GET['vitals'] === 'true') {
        // Return Owlet vitals data
        // Use historical data for analysis (minute-interval data only)
        $historyFile = 'owlet_history.json';
        // Fall back to main vitals file if history doesn't exist yet
        $vitalsFile = file_exists($historyFile) ? $historyFile : 'owlet_vitals.json';
        
        if (!file_exists($vitalsFile)) {
            echo json_encode(['vitals' => [], 'last_update' => null]);
            exit();
        }
        
        try {
            $vitalsData = file_get_contents($vitalsFile);
            $vitals = json_decode($vitalsData, true);
            
            if ($vitals === null) {
                $vitals = [];
            }
            
            // Load latest real-time data separately
            $latestReading = null;
            $latestFile = 'owlet_latest.json';
            if (file_exists($latestFile)) {
                try {
                    $latestData = file_get_contents($latestFile);
                    $latestReading = json_decode($latestData, true);
                    
                    // If history is empty but we have latest data, add it to vitals for display
                    if (empty($vitals) && !empty($latestReading)) {
                        $vitals = [$latestReading];
                    }
                } catch (Exception $e) {
                    // Latest file might not exist yet
                }
            }
            
            $response = [
                'vitals' => array_slice($vitals, 0, 100), // Limit to last 100 readings
                'last_update' => !empty($vitals) ? $vitals[0]['timestamp'] : null,
                'latest_reading' => $latestReading !== null ? $latestReading : (!empty($vitals) ? $vitals[0] : null)
            ];
            
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read vitals file']);
        }
        exit();
    }
    
    // Handle request for latest real-time data
    if (isset($_GET['latest']) && $_GET['latest'] === 'true') {
        $latestFile = 'owlet_latest.json';
        if (!file_exists($latestFile)) {
            http_response_code(404);
            echo json_encode(['error' => 'No real-time data available']);
            exit();
        }
        
        try {
            $latestData = file_get_contents($latestFile);
            $reading = json_decode($latestData, true);
            
            if ($reading === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Invalid real-time data']);
            } else {
                echo json_encode(['reading' => $reading]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read latest data']);
        }
        exit();
    }
    
    // Handle Owlet sync trigger (enable/disable sync)
    if (isset($_GET['owlet_sync_trigger'])) {
        $triggerFile = 'owlet_sync_trigger.txt';
        $action = $_GET['owlet_sync_trigger'];
        
        if ($action === 'enable') {
            // Create trigger file to enable sync
            if (file_put_contents($triggerFile, date('Y-m-d H:i:s')) !== false) {
                echo json_encode(['success' => true, 'message' => 'Owlet sync enabled']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to enable sync']);
            }
        } elseif ($action === 'disable') {
            // Delete trigger file to disable sync
            if (file_exists($triggerFile)) {
                if (unlink($triggerFile)) {
                    echo json_encode(['success' => true, 'message' => 'Owlet sync disabled']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to disable sync']);
                }
            } else {
                // File doesn't exist, but that's fine - sync is already disabled
                echo json_encode(['success' => true, 'message' => 'Owlet sync already disabled']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action. Use enable or disable']);
        }
        exit();
    }
    
    // Default: return all events
    $events = getEvents($eventsFile);
    echo json_encode($events);
    exit();
}

// Handle POST request - add new event
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit();
    }
    
    // Validate required fields
    $requiredFields = ['id', 'type', 'icon', 'time'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            exit();
        }
    }
    
    // Load existing events
    $events = getEvents($eventsFile);
    
    // Check if event with same ID already exists
    $existingIndex = -1;
    for ($i = 0; $i < count($events); $i++) {
        if ($events[$i]['id'] == $input['id']) {
            $existingIndex = $i;
            break;
        }
    }
    
    // If event exists, update it; otherwise add new event
    if ($existingIndex >= 0) {
        $events[$existingIndex] = $input;
    } else {
        // Add new event at the beginning (most recent first)
        array_unshift($events, $input);
    }
    
    // Save events back to file
    if (saveEvents($eventsFile, $events)) {
        echo json_encode(['success' => true, 'message' => 'Event saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save event to file']);
    }
    exit();
}

// Handle DELETE request - delete event by id
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing event id']);
        exit();
    }

    $events = getEvents($eventsFile);
    $beforeCount = count($events);
    $events = array_values(array_filter($events, function($e) use ($input) {
        return $e['id'] != $input['id'];
    }));
    if ($beforeCount === count($events)) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        exit();
    }

    if (saveEvents($eventsFile, $events)) {
        echo json_encode(['success' => true, 'message' => 'Event deleted']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save events file']);
    }
    exit();
}

// Handle unsupported methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
