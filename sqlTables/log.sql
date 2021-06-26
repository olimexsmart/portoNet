CREATE TABLE `log` (
	`ID` INT(11) NOT NULL AUTO_INCREMENT,
	`action` CHAR(15) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`data` DATETIME NULL DEFAULT NULL,
	`status` TINYINT(4) NULL DEFAULT NULL,
	PRIMARY KEY (`ID`) USING BTREE
)
COMMENT='Every request to the system is logged here.'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;