<?php
try {
    // подключаемся к серверу
    $conn = new PDO("mysql:host=localhost;dbname=parser", "root", "Nike7363");
     
    // SQL-выражение для создания таблицы
    $sql = "CREATE TABLE Rows (id integer auto_increment primary key, name varchar(30), age integer);";
    // выполняем SQL-выражение
    $conn->exec($sql);
    echo "Table Users has been created";
}
catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}