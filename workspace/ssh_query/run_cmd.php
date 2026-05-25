<?php
require_once('ssh_helper.php');

$conn = ssh_connect_bot();
if (!$conn) {
    die('SSH connection failed');
}

$stream = ssh2_exec($conn, "ps aux | grep node | grep -v grep");
stream_set_blocking($stream, true);
echo stream_get_contents($stream);
fclose($stream);
