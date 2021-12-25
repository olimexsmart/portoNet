<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];

logRequest($sql, "logList", $MP);

// Verify Master Password
verifyMP($sql, $MP);

// TODO add filters
$query = "SELECT * FROM logs ORDER BY dateRequest DESC LIMIT 20";
$result = queryWithError($sql, $query);

// Collect results
$toJSON = array();
while ($row = $result->fetch_assoc()) {
    $toJSON[] = $row;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($toJSON);
