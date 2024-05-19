<?php 
class Message{
    public $msg;
}
$isError = false;
$message = new Message();
 if(file_get_contents("../config.json")){
    $config = json_decode(file_get_contents("../config.json"));
    try{
        
        $conn = new PDO("mysql:host=localhost", $config->user, $config->password);
        }
        catch (PDOException $e) {
            $isError = true;
        }
 }else{
    $isError = true;
 }
 if($isError){
    $message->msg="error";
 }else{
    $message->msg="success";
 }
 echo json_encode($message);
?>