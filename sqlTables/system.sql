CREATE TABLE `system` (
	`ID` INT(11) NOT NULL,
	`MP` CHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`nOpenings` INT(11) NOT NULL DEFAULT '0',
	`nErrors` INT(11) NOT NULL DEFAULT '0',
	`nAttempts` INT(11) NULL DEFAULT '0',
	`lastAttempt` DATETIME NULL DEFAULT NULL,
	`lockedUntil` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`ID`) USING BTREE
)
COMMENT='Contains MasterPassword and status info';