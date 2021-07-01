<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];

// Verify Master Password
verifyMP($sql, $MP);

// Revoke all passwords
$query = "SELECT * FROM passwords";
$result = queryWithError($sql, $query);

// Collect results
$toJSON = array();
while ($row = $result->fetch_assoc()) {
    $toJSON[] = $row;
}

echo json_encode($toJSON);
