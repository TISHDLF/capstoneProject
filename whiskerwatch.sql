-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: whiskerwatch
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption`
--

DROP TABLE IF EXISTS `adoption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption` (
  `adoption_id` int NOT NULL AUTO_INCREMENT,
  `adoptedcat_id` int NOT NULL,
  `adopter_id` int NOT NULL,
  `cat_name` varchar(100) NOT NULL,
  `adopter` varchar(100) NOT NULL,
  `adoption_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contactnumber` varchar(45) NOT NULL,
  `certificate` mediumblob NOT NULL,
  PRIMARY KEY (`adoption_id`),
  UNIQUE KEY `adoption_id_UNIQUE` (`adoption_id`),
  KEY `adopter_id_idx` (`adopter_id`),
  KEY `adoptedcat_id_idx` (`adoptedcat_id`),
  CONSTRAINT `adoptedcat_id` FOREIGN KEY (`adoptedcat_id`) REFERENCES `cat` (`cat_id`),
  CONSTRAINT `adopter_id` FOREIGN KEY (`adopter_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption`
--

LOCK TABLES `adoption` WRITE;
/*!40000 ALTER TABLE `adoption` DISABLE KEYS */;
/*!40000 ALTER TABLE `adoption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat`
--

DROP TABLE IF EXISTS `cat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `age` varchar(45) DEFAULT NULL,
  `adoption_status` enum('Pending','Adopted','Available') DEFAULT 'Pending',
  `sterilization_status` enum('Intact','Neutered','Spayed') DEFAULT 'Intact',
  `description` text NOT NULL,
  `date_created` date DEFAULT (curdate()),
  `date_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_return` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cat_id`),
  UNIQUE KEY `cat_id_UNIQUE` (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat`
--

LOCK TABLES `cat` WRITE;
/*!40000 ALTER TABLE `cat` DISABLE KEYS */;
INSERT INTO `cat` VALUES (12,'Angelo','Male','2','Pending','Neutered','Mejo makulit, pero mabaet','2025-09-08','2025-09-10 18:03:41','2025-09-08 19:22:44'),(13,'Roberta','Female','5','Available','Neutered','He is a good and well behaved cat.','2025-09-08','2025-09-08 20:10:24','2025-09-08 23:05:56'),(14,'Geloy','Female','3','Pending','Intact','adasdasd','2025-09-09','2025-09-08 20:55:17','2025-09-09 04:55:17'),(15,'Joleta','Female','6','Pending','Intact','Mahilig manjulet si Juleta kaya tawag namin sa kanya ay puny*ta.','2025-09-09','2025-09-08 21:05:13','2025-09-09 05:05:13');
/*!40000 ALTER TABLE `cat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_images`
--

DROP TABLE IF EXISTS `cat_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `cat_id` int NOT NULL,
  `image_filename` varchar(255) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_primary` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`image_id`),
  UNIQUE KEY `image_id_UNIQUE` (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_images`
--

LOCK TABLES `cat_images` WRITE;
/*!40000 ALTER TABLE `cat_images` DISABLE KEYS */;
INSERT INTO `cat_images` VALUES (42,12,'1757558626326.jpg','2025-09-11 10:43:46',0),(43,13,'1757559392759.jpg','2025-09-11 10:56:32',0),(44,14,'1757559413694.jpg','2025-09-11 10:56:53',0),(45,15,'1757559568076.jpg','2025-09-11 10:59:28',0);
/*!40000 ALTER TABLE `cat_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation`
--

DROP TABLE IF EXISTS `donation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donation` (
  `donation_id` int NOT NULL AUTO_INCREMENT,
  `donator_id` int NOT NULL,
  `donator` varchar(100) NOT NULL,
  `donation_type` enum('Money','Food','Items','Others') NOT NULL DEFAULT 'Others',
  `date_donated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  PRIMARY KEY (`donation_id`),
  UNIQUE KEY `donation_id_UNIQUE` (`donation_id`),
  KEY `donator_id_idx` (`donator_id`),
  CONSTRAINT `donator_id` FOREIGN KEY (`donator_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation`
--

LOCK TABLES `donation` WRITE;
/*!40000 ALTER TABLE `donation` DISABLE KEYS */;
/*!40000 ALTER TABLE `donation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `profile_image` mediumblob,
  `contactnumber` varchar(20) NOT NULL,
  `birthday` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `role` enum('admin','head_volunteer','regular') DEFAULT 'regular',
  `badge` enum('Toe bean trainee','Snuggle','Furmidable Friend','Meowntain Mover','The Catnip Captain') DEFAULT 'Toe bean trainee',
  `address` text,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Angelo','Cabangal',NULL,'09084853419','2000-12-01','GeloyCabangal10@gmail.com','GeloyC','regular','Toe bean trainee','Pembo, Taguig City','Cabangal10','2025-08-28 09:22:52','2025-08-29 09:37:30','2025-09-06 23:19:50'),(4,'Keanu','Reeves',NULL,'09398059318','1964-08-02','keanureeves@gmail.com','JohnWick','head_volunteer','Toe bean trainee','Hollywood Hills home','johnwick','2025-08-29 05:45:03','2025-09-01 05:48:47','2025-09-06 23:19:50'),(5,'Mister','Bean',NULL,'09123456789','1950-12-12','MrBean@gmail.com','MrBean','admin','Toe bean trainee','America','misterbean','2025-08-31 09:13:17','2025-08-31 09:19:16','2025-09-06 23:19:50'),(6,'Wally','Bayola',NULL,'09123456789','1850-12-12','WallyBayola@gmail.com','WallyTheWakky',NULL,'Toe bean trainee','EatBulaga','Bayola1850','2025-09-01 06:38:39','2025-09-01 06:38:39','2025-09-06 23:19:50'),(7,'Wally','Bayola',NULL,'09084853419','1915-12-12','asASDq@gmail.com','sdasd',NULL,'Toe bean trainee','asdasd','cabangal','2025-09-02 09:57:04','2025-09-02 09:57:04','2025-09-06 23:19:50'),(8,'Cat','Nip',NULL,'09112233444','2000-12-01','catnip@gmail.com','CatNip',NULL,'Toe bean trainee','Luzon, Philippines','catnip123','2025-09-08 17:11:25','2025-09-08 17:11:25','2025-09-09 01:11:25'),(9,'Catnip','Enjoyer',NULL,'09123456789','1918-12-31','CatnipEnjoyer@gmail.com','Catnippers','regular','Toe bean trainee','In the forest','catnippers','2025-09-08 17:21:47','2025-09-08 17:21:47','2025-09-09 01:21:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `feeder_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `feeding_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `application_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`volunteer_id`),
  UNIQUE KEY `volunteer_id_UNIQUE` (`volunteer_id`),
  KEY `feeder_id_idx` (`feeder_id`),
  CONSTRAINT `feeder_id` FOREIGN KEY (`feeder_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer`
--

LOCK TABLES `volunteer` WRITE;
/*!40000 ALTER TABLE `volunteer` DISABLE KEYS */;
/*!40000 ALTER TABLE `volunteer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-11 11:41:08
