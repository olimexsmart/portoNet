<?php

require 'commonCode.php';

$sql = initSQLConnection();

// Get input args
$MP = $_GET['MP'];
$uKey = $_GET['uKey'];
$interval = intval($_GET['interval']);

// Verify Master Password
verifyMP($sql, $MP);

/**
 * Interpret interval value:
 * 0: 6 hours
 * 1: 3 days
 * 2: 1 month
 * 3: 1 year
 */
switch ($interval) {
    case 0:
        $interval = '6 HOUR';
        break;
    case 1:
        $interval = '3 DAY';
        break;
    case 2:
        $interval = '1 MONTH';
        break;
    case 3:
        $interval = '1 YEAR';
        break;
    default:
        http_response_code(406);
        die("Interval inserted not valid.");
        break;
}

// Add password query
$query = "INSERT INTO passwords(ID, uKey, expDate)
            VALUES(NULL, '$uKey', DATE_ADD(NOW(), INTERVAL $interval))
            ON DUPLICATE KEY UPDATE expDate=DATE_ADD(NOW(), INTERVAL $interval), revoked=0";

queryWithError($sql, $query);

echo 'DONE';
