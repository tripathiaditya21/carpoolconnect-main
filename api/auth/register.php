<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Username already taken']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, username, password, avatar)
        VALUES (?, ?, ?, ?, ?)
    ");

    $defaultAvatar = "https://ui-avatars.com/api/?name=" . urlencode($data['name']);
    
    $stmt->execute([
        $data['name'],
        $data['email'],
        $data['username'],
        $hashedPassword,
        $defaultAvatar
    ]);

    $userId = $pdo->lastInsertId();

    // Generate session token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

    $stmt = $pdo->prepare("
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$userId, $token, $expiresAt]);

    // Get user data
    $stmt = $pdo->prepare("SELECT id, name, email, username, avatar FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'user' => $user,
        'token' => $token
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Registration failed']);
} 