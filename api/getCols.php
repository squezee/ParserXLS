
    <?php
    $config = json_decode(file_get_contents("../config.json"));
    echo json_encode($config->cols);
    ?>
