<?php 

require '../vendor/autoload.php';

$postData = file_get_contents('php://input');
$data = json_decode($postData, true);
class Message{
    public $msg;
}
class Config{
    public $user;
    public $password;
    public $cols;
}
$message = new Message();
$isErrorExist = false;
try{
$conn = new PDO("mysql:host=localhost", $data['user'], $data['password']);
}
catch (PDOException $e) {
    $isErrorExist = true;
    if($e->getCode()=="1045"){
        $message->msg="1045";
        
    }else{
        $message->msg="404";
    }
    
}
if(!$isErrorExist){
    $config = new Config();
    $newCols=[];
    if ( $xls = Shuchkin\SimpleXLS::parseFile('../table.xls') ) {
        $rows = $xls->rows();

        for($i=0;$i<count($rows[0]);$i++){
            $newCols[$i]=$rows[0][$i];
        }
    }
    $config->user=$data['user'];
    $config->password=$data['password'];
    $config->cols=$newCols;
    $message->msg="success";
    $fd = fopen("../config.json", 'w') or die("Fatal error");
    fwrite($fd, json_encode($config));
    fclose($fd);
        try {
            $conn = new PDO("mysql:host=localhost", $data['user'], $data['password']);
            $sql = "CREATE DATABASE parser";
            $conn->exec($sql);
            $conn = new PDO("mysql:host=localhost;dbname=parser", $data['user'], $data['password']);
        $sql = "create table items (id integer auto_increment primary key";
        for($i=0;$i<count($newCols);$i++){
            $sql = $sql.", col".$i." "."varchar(70)";
        }
        $sql = $sql.");";
        echo $sql;
        $conn->exec($sql);
        }catch(PDOException $e){}
        
}
echo json_encode($message);
?>