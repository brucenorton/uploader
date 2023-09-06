<?php
// ** replace the FOLLOWING inf
$host = "localhost:3306";
$db = "YOUR_DB_NAME";
$user = "YOUR_DB_USER";
$pass = "YOUR_DB_PASSWORD";

$link = mysqli_connect($host, $user, $pass, $db);

$db_response = [];
$db_response['success'] = 'not set';

if(!$link){
  $db_response['success'] = false;
}else{
  $db_response['success'] = true;
}
//echo out when live
//echo json_encode($db_response);


?>