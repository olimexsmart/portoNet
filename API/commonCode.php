<?php

/**
 * Initialize connection to the DB. 
 * Sets error code 502 if fails.
 */
function initSQLConnection()
{
    require 'login.php';
    // Create connection
    $sql = new mysqli($hostName, $username, $password, $dbname);
    // Check connection
    if ($sql->connect_error) {
        http_response_code(502);
        die("Connection failed: " . $sql->connect_error);
    }
    return $sql;
}

/**
 * Incapsultes query with error managing.
 * Returns the result of the query.
 */
function queryWithError($sql, $query)
{
    if (!$result = $sql->query($query)) {
        http_response_code(506);
        die("Error: " . $query . " " . $sql->error . "\n");
    }
    return $result;
}

/**
 * Verifies the MasterPassword.
 * Since every system modification requires this check,
 * it is incapsulated into a function that stops the
 * script if check fails.
 */
function verifyMP($sql, $MP)
{
    $query = "SELECT * FROM system WHERE system.ID=1 AND system.MP='$MP'";
    $result = queryWithError($sql, $query);

    if ($result->num_rows != 1) { // Error
        http_response_code(401);
        die("Incorrect Master Password");
    } else { // Reset possible error states
        $query = "UPDATE system SET nAttempts = 0, lastAttempt = NULL, lockedUntil = NULL WHERE ID = 1";
        queryWithError($sql, $query);
    }
}

/**
 * Log a request with all the parameters
 */
function logRequest($sql, $APIName, ...$params) {
    $imploded = implode('@', $params);
    $query = "INSERT INTO logs(ID, APIName, dateRequest, params) 
                VALUES(NULL, '$APIName', NOW(), '$imploded')";

    queryWithError($sql, $query);
}
