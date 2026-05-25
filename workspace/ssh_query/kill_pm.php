<?php
require_once('ssh_helper.php');

$conn = ssh_connect_bot();
if (!$conn) {
    die('SSH connection failed');
}

$stream = ssh2_exec($conn, 'pm2 kill');
fclose($stream);
