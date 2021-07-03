<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];
$uKey = $_GET['uKey'];

logRequest($sql, "revoke", $MP, $uKey);

// Verify Master Password
verifyMP($sql, $MP);

// Revoke all passwords
$query = "UPDATE passwords SET revoked=1 WHERE uKey='$uKey'";
queryWithError($sql, $query);

echo 'DONE';
