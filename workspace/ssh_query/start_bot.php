<?php
require_once('ssh_helper.php');
require_once('../../php/connect.php');

$uid = $_POST['uid'];
$bid = $_POST['bid'];

$conn = ssh_connect_bot();
if (!$conn) {
    die('SSH connection failed');
}

$path = $uid . "/" . $bid;
$script = file_get_contents("../bots/" . $path . "/index.js");

$stream = ssh2_exec($conn, 'if [ ! -d "users_bots/' . $path . '" ]; then echo "False"; else echo "True"; fi');
stream_set_blocking($stream, true);
$dirExist = trim(strip_tags(stream_get_contents($stream)));
stream_set_blocking($stream, false);

if ($dirExist == "False") {
    ssh2_exec($conn, 'mkdir -p "users_bots/' . $path . '"');
}

$stream = ssh2_exec($conn, 'echo "' . $script . '" > users_bots/' . $path . '/' . $bid . '.js');
stream_set_blocking($stream, true);
stream_get_contents($stream);
stream_set_blocking($stream, false);

echo "Bot deployed on users_bots/" . $path . "/" . $bid . ".js";

$stream = ssh2_exec($conn, 'pm2 start users_bots/' . $path . '/' . $bid . '.js');

$sql1 = "UPDATE `bot` SET `status`='On' WHERE id = ?";
$data = $pdo->prepare($sql1);
$data->execute(array($bid));

fclose($stream);
