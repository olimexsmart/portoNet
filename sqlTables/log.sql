CREATE TABLE `logs` (
	`ID` INT(11) NOT NULL AUTO_INCREMENT,
	`APIName` CHAR(15) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dateRequest` DATETIME NULL DEFAULT NULL,
	`params` VARCHAR(250) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`ID`) USING BTREE
)
COMMENT='Every request to the system is logged here.'
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;
