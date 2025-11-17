<?php
// ============================================
// EVENTS.PHP - Baby Monitor API
// Organized for maintainability and clarity
// ============================================

// ============================================
// CONFIGURATION & HEADERS
// ============================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

date_default_timezone_set('Europe/Tallinn');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$eventsFile = 'events.json';

// ============================================
// UTILITY FUNCTIONS - File I/O & Responses
// ============================================

/**
 * Read JSON file and return parsed data
 */
function readJsonFile($file) {
    if (!file_exists($file)) {
        return null;
    }
    
    try {
        $jsonData = file_get_contents($file);
        if ($jsonData === false) {
            return null;
        }
        return json_decode($jsonData, true);
    } catch (Exception $e) {
        error_log("Error reading file $file: " . $e->getMessage());
        return null;
    }
}

/**
 * Write JSON data to file
 */
function writeJsonFile($file, $data) {
    try {
        $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return file_put_contents($file, $jsonData, LOCK_EX) !== false;
    } catch (Exception $e) {
        error_log("Error writing file $file: " . $e->getMessage());
        return false;
    }
}

/**
 * Send JSON response
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

/**
 * Send error response
 */
function sendError($message, $statusCode = 400) {
    sendJsonResponse(['error' => $message], $statusCode);
}

// ============================================
// EVENTS CRUD OPERATIONS
// ============================================

/**
 * Get all events
 */
function handleEventsGet() {
    global $eventsFile;
    
    $events = readJsonFile($eventsFile);
    if ($events === null) {
        $events = [];
    }
    
    sendJsonResponse($events);
}

/**
 * Create or update event
 */
function handleEventsPost() {
    global $eventsFile;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        sendError('Invalid JSON data', 400);
    }
    
    // Validate required fields
    $requiredFields = ['id', 'type', 'icon', 'time'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field])) {
            sendError("Missing required field: $field", 400);
        }
    }
    
    // Load existing events
    $events = readJsonFile($eventsFile);
    if ($events === null) {
        $events = [];
    }
    
    // Find and update or add
    $existingIndex = -1;
    for ($i = 0; $i < count($events); $i++) {
        if ($events[$i]['id'] == $input['id']) {
            $existingIndex = $i;
            break;
        }
    }
    
    if ($existingIndex >= 0) {
        $events[$existingIndex] = $input;
    } else {
        array_unshift($events, $input);
    }
    
    // Save events
    if (writeJsonFile($eventsFile, $events)) {
        sendJsonResponse(['success' => true, 'message' => 'Event saved successfully']);
    } else {
        sendError('Failed to save event', 500);
    }
}

/**
 * Delete event by ID
 */
function handleEventsDelete() {
    global $eventsFile;
    
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input === null || !isset($input['id'])) {
        sendError('Missing event id', 400);
    }

    $events = readJsonFile($eventsFile);
    if ($events === null) {
        $events = [];
    }
    
    $beforeCount = count($events);
    $events = array_values(array_filter($events, function($e) use ($input) {
        return $e['id'] != $input['id'];
    }));
    
    if ($beforeCount === count($events)) {
        sendError('Event not found', 404);
    }

    if (writeJsonFile($eventsFile, $events)) {
        sendJsonResponse(['success' => true, 'message' => 'Event deleted']);
    } else {
        sendError('Failed to save events file', 500);
    }
}

// ============================================
// OWLET VITALS ENDPOINTS
// ============================================

/**
 * Get latest vital reading
 */
function handleOwletLatest() {
    $latestFile = 'owlet_latest.json';
    if (!file_exists($latestFile)) {
        sendError('No real-time data available', 404);
    }
    
    try {
        $latestData = file_get_contents($latestFile);
        $reading = json_decode($latestData, true);
        
        if ($reading === null) {
            sendError('Invalid real-time data', 404);
        } else {
            sendJsonResponse(['reading' => $reading]);
        }
    } catch (Exception $e) {
        sendError('Failed to read latest data', 500);
    }
}

/**
 * Get vitals history and analysis
 */
function handleOwletVitals() {
    $historyFile = 'owlet_history.json';
    $vitalsFile = file_exists($historyFile) ? $historyFile : 'owlet_vitals.json';
    
    if (!file_exists($vitalsFile)) {
        sendJsonResponse(['vitals' => [], 'last_update' => null]);
    }
    
    try {
        $vitalsData = readJsonFile($vitalsFile);
        $vitals = $vitalsData === null ? [] : $vitalsData;
        
        // Load latest reading separately
        $latestReading = null;
        $latestFile = 'owlet_latest.json';
        if (file_exists($latestFile)) {
            $latestReading = readJsonFile($latestFile);
            
            // If history is empty but we have latest data, use it
            if (empty($vitals) && !empty($latestReading)) {
                $vitals = [$latestReading];
            }
        }
        
        $response = [
            'vitals' => array_slice($vitals, 0, 100),
            'last_update' => !empty($vitals) ? $vitals[0]['timestamp'] : null,
            'latest_reading' => $latestReading !== null ? $latestReading : (!empty($vitals) ? $vitals[0] : null)
        ];
        
        sendJsonResponse($response);
    } catch (Exception $e) {
        sendError('Failed to read vitals file', 500);
    }
}

/**
 * Get daily summaries for historical analysis
 */
function handleOwletSummaries() {
    $summariesDir = 'owlet_daily_summaries';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 30;
    
    $summaries = [];
    
    if (!is_dir($summariesDir)) {
        sendJsonResponse([
            'summaries' => $summaries,
            'total_days' => 0,
            'last_update' => null
        ]);
    }
    
    try {
        $files = array_diff(scandir($summariesDir, SCANDIR_SORT_DESCENDING), ['.', '..']);
        $count = 0;
        
        foreach ($files as $file) {
            if (substr($file, -5) === '.json' && $count < $limit) {
                $filepath = $summariesDir . '/' . $file;
                $data = readJsonFile($filepath);
                if ($data && isset($data['date'])) {
                    $summaries[] = $data;
                    $count++;
                }
            }
        }
        
        // Include today's hourly data if available
        $todaysHourly = readJsonFile('owlet_todays_hourly.json');
        if ($todaysHourly && !empty($todaysHourly['hourly'])) {
            array_unshift($summaries, $todaysHourly);
        }
        
        sendJsonResponse([
            'summaries' => $summaries,
            'total_days' => count($summaries),
            'last_update' => !empty($summaries) ? $summaries[0]['last_update'] ?? $summaries[0]['last_timestamp'] ?? null : null
        ]);
    } catch (Exception $e) {
        sendError('Failed to read summaries', 500);
    }
}

/**
 * Get today's hourly aggregated data
 */
function handleOwletTodaysHourly() {
    $filename = 'owlet_todays_hourly.json';
    
    if (!file_exists($filename)) {
        sendJsonResponse([
            'date' => date('Y-m-d', time()),
            'hourly' => [],
            'total_hours' => 0,
            'last_update' => null
        ]);
    }
    
    try {
        $data = readJsonFile($filename);
        if ($data === null) {
            sendJsonResponse([
                'date' => date('Y-m-d', time()),
                'hourly' => [],
                'total_hours' => 0,
                'last_update' => null
            ]);
        }
        sendJsonResponse($data);
    } catch (Exception $e) {
        sendError('Failed to read today\'s hourly data', 500);
    }
}

// ============================================
// ROUTING LOGIC
// ============================================

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Route based on query parameters
    if (isset($_GET['latest']) && $_GET['latest'] === 'true') {
        handleOwletLatest();
    }
    elseif (isset($_GET['vitals']) && $_GET['vitals'] === 'true') {
        handleOwletVitals();
    }
    elseif (isset($_GET['summaries']) && $_GET['summaries'] === 'true') {
        handleOwletSummaries();
    }
    elseif (isset($_GET['todays_hourly']) && $_GET['todays_hourly'] === 'true') {
        handleOwletTodaysHourly();
    }
    else {
        // Default: return all events
        handleEventsGet();
    }
}
elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    handleEventsPost();
}
elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    handleEventsDelete();
}
else {
    sendError('Method not allowed', 405);
}
?>

