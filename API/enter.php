<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$uKey = $_GET['uKey'];
$justTest = $_GET['justTest'];

// Query that checks both key and if expired
$query = "SELECT * FROM passwords WHERE uKey = '$uKey' AND expDate > NOW() AND revoked=0";
$result = queryWithError($sql, $query);

if ($result->num_rows == 1) {
    if (!$justTest) {     
        // Update nUsed and lastUsed           
        $resArr = $result->fetch_assoc();
        $ID = $resArr['ID'];
        $query = "UPDATE passwords SET nUsed = nUsed + 1, lastUsed = NOW() WHERE ID = $ID";
        queryWithError($sql, $query);

        require 'doorOpen.php';
        openDoor();
    }
} else {
    // First check if key exists
    $query = "SELECT * FROM passwords WHERE uKey = '$uKey'";
    $result = queryWithError($sql, $query);    
    if ($result->num_rows == 0) {
        http_response_code(404);    
        die("User Key not found");
    }
    // At this point we ca use the ID
    $resArr = $result->fetch_assoc();
    $ID = $resArr['ID'];

    // Then if it expired
    $query = "SELECT * FROM passwords WHERE ID = $ID AND expDate > NOW()";
    $result = queryWithError($sql, $query);    
    if ($result->num_rows == 0) {
        http_response_code(408);    
        die("User Key expired");
    }

    // Then if it was revoked
    $query = "SELECT * FROM passwords WHERE ID = $ID AND revoked!=0";
    $result = queryWithError($sql, $query); 
    if ($result->num_rows > 0) {
        http_response_code(410);    
        die("User Key was revoked");
    }

    // Generic error if none of the above - should be unreachable code
    http_response_code(401);
    die("Incorrect User Key");
}

echo 'DONE';