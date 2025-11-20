<?php
/**
 * Backup Events to Database Script
 * 
 * This script reads events.json and backs up all events to a database table.
 * Designed to be run via cron once per day.
 * 
 * Usage:
 *   php backup_events_to_db.php
 * 
 * Configuration:
 *   Edit the database connection settings below or set environment variables:
 *   - DB_HOST
 *   - DB_NAME
 *   - DB_USER
 *   - DB_PASS
 */

// Set timezone
date_default_timezone_set('Europe/Tallinn');

// Database configuration
// You can override these with environment variables
$dbConfig = [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'name' => getenv('DB_NAME') ?: 'baby_monitor',
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
    'charset' => 'utf8mb4'
];

// File paths
$eventsFile = __DIR__ . '/events.json';
$logFile = __DIR__ . '/backup_events.log';

// Logging function
function logMessage($message, $logFile) {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Error handler
function handleError($message, $logFile) {
    logMessage("ERROR: $message", $logFile);
    error_log($message);
    exit(1);
}

// Check if events.json exists
if (!file_exists($eventsFile)) {
    handleError("Events file not found: $eventsFile", $logFile);
}

// Read events.json
logMessage("Reading events from $eventsFile", $logFile);
$jsonData = file_get_contents($eventsFile);
if ($jsonData === false) {
    handleError("Failed to read events file", $logFile);
}

$events = json_decode($jsonData, true);
if ($events === null) {
    handleError("Invalid JSON in events file: " . json_last_error_msg(), $logFile);
}

if (!is_array($events)) {
    handleError("Events file does not contain an array", $logFile);
}

logMessage("Found " . count($events) . " events to backup", $logFile);

// Connect to database
try {
    $dsn = "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset={$dbConfig['charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], $options);
    logMessage("Connected to database: {$dbConfig['name']}", $logFile);
} catch (PDOException $e) {
    handleError("Database connection failed: " . $e->getMessage(), $logFile);
}

// Prepare INSERT statement with ON DUPLICATE KEY UPDATE
$sql = "INSERT INTO events_backups (event_id, event_type, icon, event_time, notes, backup_date, created_at)
        VALUES (:id, :type, :icon, :time, :notes, CURDATE(), NOW())
        ON DUPLICATE KEY UPDATE
            event_type = VALUES(event_type),
            icon = VALUES(icon),
            event_time = VALUES(event_time),
            notes = VALUES(notes),
            backup_date = CURDATE(),
            updated_at = NOW()";

try {
    $stmt = $pdo->prepare($sql);
} catch (PDOException $e) {
    handleError("Failed to prepare SQL statement: " . $e->getMessage(), $logFile);
}

// Backup each event
$successCount = 0;
$errorCount = 0;
$skippedCount = 0;

foreach ($events as $event) {
    // Validate required fields
    if (!isset($event['id']) || !isset($event['type']) || !isset($event['icon']) || !isset($event['time'])) {
        logMessage("Skipping invalid event (missing required fields): " . json_encode($event), $logFile);
        $skippedCount++;
        continue;
    }
    
    try {
        $stmt->execute([
            ':id' => $event['id'],
            ':type' => $event['type'],
            ':icon' => $event['icon'],
            ':time' => $event['time'],
            ':notes' => isset($event['notes']) ? $event['notes'] : ''
        ]);
        $successCount++;
    } catch (PDOException $e) {
        logMessage("Failed to backup event ID {$event['id']}: " . $e->getMessage(), $logFile);
        $errorCount++;
    }
}

// Summary
$summary = sprintf(
    "Backup completed: %d successful, %d errors, %d skipped",
    $successCount,
    $errorCount,
    $skippedCount
);
logMessage($summary, $logFile);

// Exit with error code if there were errors
if ($errorCount > 0) {
    exit(1);
}

exit(0);
?>

