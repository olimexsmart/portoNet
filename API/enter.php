<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$uKey = $_GET['uKey'];
$justTest = (int) $_GET['justTest'];

logRequest($sql, "enter", $uKey, $justTest);

// Check if system is not locked
$query = "SELECT * FROM system WHERE ID = 1 AND lockedUntil > NOW()";
$result = queryWithError($sql, $query);
if ($result->num_rows > 0) {
    // If trying to do something with system locked, raise nErrors
    $query = "UPDATE system SET nErrors = nErrors + 1 WHERE ID = 1";
    queryWithError($sql, $query);
    http_response_code(423);
    die("Too many attempts, system is locked");
} 

// Reset nAttempts if last failed attempts was more than 15 ago
$query = "UPDATE system set nAttempts = 0, lastAttempt = NULL 
            WHERE ID = 1 AND NOW() > DATE_ADD(lastAttempt, INTERVAL 15 MINUTE)";
queryWithError($sql, $query);


// Query that checks both key and if expired or revoked
$query = "SELECT * FROM passwords WHERE uKey = '$uKey' AND expDate > NOW() AND revoked=0";
$result = queryWithError($sql, $query);
if ($result->num_rows == 1) {
    if (!$justTest) {
        // Update nUsed and lastUsed           
        $resArr = $result->fetch_assoc();
        $ID = $resArr['ID'];
        $query = "UPDATE passwords SET nUsed = nUsed + 1, lastUsed = NOW() WHERE ID = $ID";
        queryWithError($sql, $query);

        // Update nOpenings, and reset nAttempts, lastAttempt, lockedUntil
        $query = "UPDATE system SET nOpenings = nOpenings + 1, nAttempts = 0, 
                lastAttempt = NULL, lockedUntil = NULL WHERE ID = 1";
        queryWithError($sql, $query);

        require 'doorOpen.php';
        openDoor();
    }
} else {
    if (!$justTest) {
        // Update nErrors, nAttempts and lastAttempt
        $query = "UPDATE system SET nErrors = nErrors + 1, nAttempts = nAttempts + 1, lastAttempt = NOW()";
        queryWithError($sql, $query);

        // Lock system for 15 minutes if this was the 3rd failed attempt in a row
        $query = "SELECT nAttempts FROM system WHERE ID = 1";
        $result = queryWithError($sql, $query);
        if ($result->num_rows != 1) {
            http_response_code(503);
            die("Error in system table");
        }        
        $resArr = $result->fetch_assoc();
        $nAttempts = $resArr['nAttempts'];
        if($nAttempts > 10) {
            $query = "UPDATE system SET lockedUntil = DATE_ADD(NOW(), INTERVAL 15 MINUTE), 
                        nAttempts = 0, lastAttempt = NULL WHERE ID = 1";
            queryWithError($sql, $query);
        }
    }

    // Additional queries to understand the login failure

    // First check if key exists
    $query = "SELECT * FROM passwords WHERE uKey = '$uKey'";
    $result = queryWithError($sql, $query);
    if ($result->num_rows == 0) {
        http_response_code(404);
        die("User Key not found");
    }

    // At this point we can use the ID
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
