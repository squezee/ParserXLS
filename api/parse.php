<?php 

require '../vendor/autoload.php';
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);
$config = json_decode(file_get_contents("../config.json"));
$cols = $config->cols;
$result = [];
$countOfCoincidences = 0;
if ( $xls = Shuchkin\SimpleXLS::parseFile('../table.xls') ) {
    $rows = $xls->rows();
    for($i=1;$i<count($rows);$i++){
        $countOfConditions = 0;
        $countOfSuccessConditions = 0;
        for($j=0;$j<count($data['conditions']);$j++){
            for($l=0;$l<count($rows[$i]);$l++){
                if($cols[$l]==$data['conditions'][$j]['col']){
                    $countOfConditions++;
                    switch($data['conditions'][$j]['name']){
                        case "forValue":
                            if($rows[$i][$l]==$data['conditions'][$j]['value']){
                                $countOfSuccessConditions++;
                            }
                            break;
                        case "startedBy":
                            if(substr($rows[$i][$l], 0, strlen($data['conditions'][$j]['value']))==$data['conditions'][$j]['value']){
                                $countOfSuccessConditions++;
                            }
                            break;
                        case "endedBy":
                            if(substr($rows[$i][$l], -1, strlen($data['conditions'][$j]['value']))==$data['conditions'][$j]['value']){
                                $countOfSuccessConditions++;
                            }
                            break;
                        case "contains":
                            if(str_contains($rows[$i][$l], $data['conditions'][$j]['value'])){
                                $countOfSuccessConditions++;
                            }
                            break;
                        case "range":
                            if($rows[$i][$l]!=null){
                                $valueToInt = intval($rows[$i][$l]);
                                if($valueToInt!=0){
                                    if($valueToInt>=intval($data['conditions'][$j]["left"])&&$valueToInt<=intval($data['conditions'][$j]["right"])){
                                        $countOfSuccessConditions++;
                                    }
                                }
                            }
                            
                            break;
                    }
                }
            }
        }
        if($countOfConditions==$countOfSuccessConditions&&$countOfCoincidences<$data['rowsToFind']){
            $result[$i] = $rows[$i];
            $countOfCoincidences++;
        }
        
    }
}
$values = array_values([...$result]);
for($i=0;$i<count($values);$i++){
    try {
        $conn = new PDO("mysql:host=localhost;dbname=parser", $config->user, $config->password);
        $sql = "SELECT * FROM items WHERE ";
        for($j=0;$j<count($cols);$j++){
            if($j!=0){
                $sql=$sql." AND (col".$j."='".$values[$i][$j]."')";
            }else{
                $sql=$sql."(col".$j."='".$values[$i][$j]."')";
            }
            
        }
        $sql=$sql.";";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        if($stmt->rowCount() <= 0){
            $sql = "INSERT INTO items (";
            for($j=0;$j<count($cols);$j++){
                if($j!=0){
                    $sql=$sql.",col".$j;
                }else{
                    $sql=$sql."col".$j;
                }
                
            }
            $sql=$sql.") VALUES (";
            for($j=0;$j<count($cols);$j++){
                if($j!=0){
                    $sql=$sql.","."'".$values[$i][$j]."'";
                }else{
                    $sql=$sql."'".$values[$i][$j]."'";
                }
                
            }
            $sql=$sql.");";
            $conn->exec($sql);
        }
        
    }
    catch (PDOException $e) {
        echo "Database error: " . $e->getMessage();
    }
}
echo json_encode($values, JSON_PRETTY_PRINT);
?>