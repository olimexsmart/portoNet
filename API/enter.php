<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];
$uKey = $_GET['uKey'];
$justTest = $_GET['justTest'];

// Query that checks both key and if expired
$query = "SELECT * FROM passwords WHERE uKey = '$uKey' AND expDate > NOW() AND revoked=0";
$result = queryWithError($sql, $query);

if ($result->num_rows == 1) {
    if (!$justTest) {        
        // TODO UPDATE nUsed, lastUsed
        echo "OPEN";
        // TODO open door script should be runned in another thread to avoid blocking this one
    }
} else {
    // TODO Query again to get different error codes
    http_response_code(401);
    die("Incorred User Key");
}

echo 'DONE';