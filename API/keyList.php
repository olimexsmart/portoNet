<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];

logRequest($sql, "keyList", $MP);

// Verify Master Password
verifyMP($sql, $MP);

// TODO add filters
$query = "SELECT * FROM passwords ORDER BY lastUsed DESC";
$result = queryWithError($sql, $query);

// Collect results
$toJSON = array();
while ($row = $result->fetch_assoc()) {
    $toJSON[] = $row;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($toJSON);
