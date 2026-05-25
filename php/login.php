<?
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

$safe_login=$_POST['login'];
$safe_pass=$_POST['pass'];
$safe_pass=md5($safe_pass);
$count=0;
require_once('connect.php');

$sql = "SELECT * FROM user WHERE name like ? and pass like ?";
$result = $pdo->prepare($sql);
$result->execute(array("$safe_login","$safe_pass"));
$line2=$result->fetchAll();
$count=count($line2);

$line=$result->fetch();


// echo $count;
echo json_encode($line2[0])
?>