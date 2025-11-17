<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

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

// Handle GET request - return all events or vitals
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if requesting vitals data
    if (isset($_GET['vitals']) && $_GET['vitals'] === 'true') {
        // Return Owlet vitals data
        $vitalsFile = 'owlet_vitals.json';
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
            
            $response = [
                'vitals' => array_slice($vitals, 0, 100), // Limit to last 100 readings
                'last_update' => !empty($vitals) ? $vitals[0]['timestamp'] : null,
                'latest_reading' => !empty($vitals) ? $vitals[0] : null
            ];
            
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read vitals file']);
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
