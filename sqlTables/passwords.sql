CREATE TABLE `passwords` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `uKey` char(20) NOT NULL,
  `expDate` datetime DEFAULT NULL,
  `lastUsed` datetime DEFAULT NULL,
  `nUsed` int(11) NOT NULL DEFAULT 0,
  `revoked` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE KEY `passwords_UN` (`uKey`)
) 

ENGINE=InnoDB 
AUTO_INCREMENT=0 
DEFAULT CHARSET=utf8mb4 COMMENT='All the added passwords will end up here.'