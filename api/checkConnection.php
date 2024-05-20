<?php 
 if(file_get_contents("../config.json")){
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
 }
?>