<?php

require 'commonCode.php';

$sql = initSQLConnection();

$query = "SELECT nOpenings, nErrors FROM system WHERE ID = 1";
$result = queryWithError($sql, $query);
echo json_encode($result->fetch_assoc());