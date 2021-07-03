<?php

require 'commonCode.php';

$sql = initSQLConnection();

logRequest($sql, "count");

$query = "SELECT nOpenings, nErrors FROM system WHERE ID = 1";
$result = queryWithError($sql, $query);

header('Content-type:application/json;charset=utf-8');
echo json_encode($result->fetch_assoc());