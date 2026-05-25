<?php
require_once('ssh_helper.php');
require_once('../../php/connect.php');

$uid = $_POST['uid'];
$bid = $_POST['bid'];

$conn = ssh_connect_bot();
if (!$conn) {
    die('SSH connection failed');
}

$stream = ssh2_exec($conn, 'pm2 stop ' . $bid);
fclose($stream);

$sql1 = "UPDATE `bot` SET `status`='Off' WHERE id = ?";
$data = $pdo->prepare($sql1);
$data->execute(array($bid));
