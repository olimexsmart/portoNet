CREATE TABLE `passwords` (
	`ID` INT(11) NOT NULL AUTO_INCREMENT,
	`uKey` CHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`expDate` DATETIME NULL DEFAULT NULL,
	`lastUsed` DATETIME NULL DEFAULT NULL,
	`nUsed` INT(11) NOT NULL DEFAULT '0',
	`revoked` TINYINT(4) NOT NULL DEFAULT '0',
	PRIMARY KEY (`ID`) USING BTREE
)
COMMENT='All the added passwords will end up here. '
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
