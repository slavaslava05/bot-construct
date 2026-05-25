<?php
$configPath = __DIR__ . '/config.local.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    die('Создай config.local.php на основе config.local.example.php');
}
$config = require $configPath;

$db = $config['db'];
$host = $db['host'];
$user = $db['user'];
$pass = $db['pass'];
$dbname = $db['name'];
$charset = $db['charset'] ?? 'utf8';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$opt = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];
$pdo = new PDO($dsn, $user, $pass, $opt);
