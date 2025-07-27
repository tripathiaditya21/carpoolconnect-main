<?php
require_once '../../config/google_config.php';

// Generate random state parameter
$state = bin2hex(random_bytes(16));
$_SESSION['oauth_state'] = $state;

// Build Google OAuth URL
$params = [
    'client_id' => GOOGLE_CLIENT_ID,
    'redirect_uri' => GOOGLE_REDIRECT_URI,
    'response_type' => 'code',
    'scope' => 'email profile',
    'state' => $state,
    'access_type' => 'online',
    'prompt' => 'select_account'
];

$authUrl = GOOGLE_AUTH_URL . '?' . http_build_query($params);

// Redirect to Google
header('Location: ' . $authUrl);
exit; 