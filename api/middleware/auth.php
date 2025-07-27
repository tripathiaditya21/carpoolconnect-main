<?php
require_once __DIR__ . '/../config/database.php';

function authenticate() {
    global $pdo;
    
    // Get token from header
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    try {
        // Verify token
        $stmt = $pdo->prepare("
            SELECT u.*, s.expires_at 
            FROM users u 
            JOIN sessions s ON u.id = s.user_id 
            WHERE s.token = ? AND s.expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }

        // Remove sensitive data
        unset($user['password']);
        unset($user['google_id']);
        unset($user['expires_at']);

        return $user;

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Authentication failed']);
        exit;
    }
} 