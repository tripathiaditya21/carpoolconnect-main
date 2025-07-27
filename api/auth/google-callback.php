<?php
session_start();
require_once '../../config/database.php';
require_once '../../config/google_config.php';

// Verify state parameter
if (!isset($_GET['state']) || !isset($_SESSION['oauth_state']) || $_GET['state'] !== $_SESSION['oauth_state']) {
    die('Invalid state parameter');
}

// Clear state from session
unset($_SESSION['oauth_state']);

if (!isset($_GET['code'])) {
    die('No authorization code received');
}

try {
    // Exchange code for access token
    $ch = curl_init(GOOGLE_TOKEN_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'code' => $_GET['code'],
        'client_id' => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'grant_type' => 'authorization_code'
    ]));

    $response = curl_exec($ch);
    $tokenData = json_decode($response, true);
    curl_close($ch);

    if (!isset($tokenData['access_token'])) {
        die('Failed to get access token');
    }

    // Get user info from Google
    $ch = curl_init(GOOGLE_USERINFO_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $tokenData['access_token']
    ]);

    $response = curl_exec($ch);
    $userData = json_decode($response, true);
    curl_close($ch);

    if (!isset($userData['email'])) {
        die('Failed to get user info');
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR google_id = ?");
    $stmt->execute([$userData['email'], $userData['sub']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        // Create new user
        $username = explode('@', $userData['email'])[0] . rand(100, 999);
        
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, username, google_id, avatar)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $userData['name'],
            $userData['email'],
            $username,
            $userData['sub'],
            $userData['picture']
        ]);

        $userId = $pdo->lastInsertId();
        
        // Get the newly created user
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Generate session token
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

    // Delete old sessions
    $stmt = $pdo->prepare("DELETE FROM sessions WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    // Create new session
    $stmt = $pdo->prepare("
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$user['id'], $token, $expiresAt]);

    // Remove sensitive data
    unset($user['password']);
    unset($user['google_id']);

    // Set session data
    $_SESSION['user'] = $user;
    $_SESSION['token'] = $token;

    // Redirect to frontend with token
    header('Location: ' . $_ENV['FRONTEND_URL'] . '/auth/google-callback?token=' . $token);
    exit;

} catch (Exception $e) {
    die('Authentication failed: ' . $e->getMessage());
} 