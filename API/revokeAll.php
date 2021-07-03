<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];

logRequest($sql, "revokeAll", $MP);

// Verify Master Password
verifyMP($sql, $MP);

// Revoke all passwords
$query = "UPDATE passwords SET revoked=1";
queryWithError($sql, $query);

echo 'DONE';
