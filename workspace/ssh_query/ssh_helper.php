<?php
require_once __DIR__ . '/../../php/connect.php';

function ssh_connect_bot() {
    global $config;
    $ssh = $config['ssh'];
    $conn = ssh2_connect($ssh['host'], $ssh['port']);
    if (!$conn) {
        return null;
    }
    if (!ssh2_auth_password($conn, $ssh['user'], $ssh['pass'])) {
        return null;
    }
    return $conn;
}
