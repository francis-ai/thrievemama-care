-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 25, 2025 at 10:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thrivemama_care`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_about_us`
--

CREATE TABLE `tbl_about_us` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `about_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_about_us`
--

INSERT INTO `tbl_about_us` (`id`, `title`, `content`, `about_image`) VALUES
(1, 'About Us at Thrivemama', 'ThriveMama bridges the gap between families seeking dependable care and caregivers offering their support and expertise. We believe that every parent deserves peace of mind, and every caregiver deserves respect and opportunity.\r\n\r\nAt ThriveMama, we’re more than just a service, we’re a growing community rooted in trust, compassion, and care.', '1749694721396-image-1.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admins`
--

CREATE TABLE `tbl_admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_admins`
--

INSERT INTO `tbl_admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Super Admin', 'admin@gmail.com', '$2b$10$5e9pvl7EZL/5Nw7SLW4PseMXwFik/lnjl6UkjEyloNa21WuaaOYeW', '2025-06-11 12:11:27'),
(2, 'Admin 2', 'admin2@gmail.com', '$2b$10$yfll1GtbO8DPx.V5on9sueFusD3c/I3vK2iwrl47eIl7tg4a8c/D6', '2025-06-11 21:36:30');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_appointments`
--

CREATE TABLE `tbl_appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'Scheduled',
  `payment_reference` varchar(100) DEFAULT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_appointments`
--

INSERT INTO `tbl_appointments` (`id`, `caregiver_id`, `user_id`, `request_id`, `appointment_date`, `appointment_time`, `status`, `payment_reference`, `amount_paid`, `created_at`) VALUES
(1, 1, 1, 4, '2025-06-20', '20:35:00', 'Scheduled', 'APP-1750303904052-805', 6500.00, '2025-06-19 03:31:51'),
(2, 2, 3, 5, '2025-06-21', '09:40:00', 'Completed', 'APP-1750304122674-780', 7000.00, '2025-06-19 03:35:29'),
(3, 2, 2, 6, '2025-06-21', '07:40:00', 'Scheduled', 'APP-1750304335286-924', 6000.00, '2025-06-19 03:39:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_caregivers`
--

CREATE TABLE `tbl_caregivers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` varchar(225) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL,
  `available_balance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_caregivers`
--

INSERT INTO `tbl_caregivers` (`id`, `name`, `email`, `phone`, `gender`, `address`, `password`, `status`, `created_at`, `profile_image`, `available_balance`) VALUES
(1, 'caregiver 1', 'caregiver1@gmail.com', '080123456789', 'female', 'Yaba', '$2b$10$BQ9Wpud/5aNBYnQMNkoEL.obPJsSKqSqe.TCltvoxN4zx.qUhp4oq', 'verified', '2025-06-15 11:41:21', '1750133599698-woman-3.jpeg', 6500.00),
(2, 'caregiver 2', 'caregiver2@gmail.com', '080123456789', 'female', NULL, '$2b$10$rkAI3qeL1T5XpEfsknONZ.moAj1IAPvhOOw5UtDpaGYnIj7Q3.tCe', 'verified', '2025-06-15 11:41:54', NULL, 7000.00),
(3, 'caregiver 3', 'caregiver3@gmail.com', '080123456789', 'female', NULL, '$2b$10$f1wH3rk4J/6m.P7/JZjiiuN0Hzh1IAUhcgmwR1XYuXwiJd/taVB/e', 'pending', '2025-06-15 11:42:20', NULL, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_caregiver_interests`
--

CREATE TABLE `tbl_caregiver_interests` (
  `id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `interested` tinyint(1) DEFAULT 1,
  `status` varchar(225) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_caregiver_interests`
--

INSERT INTO `tbl_caregiver_interests` (`id`, `caregiver_id`, `request_id`, `interested`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'Approved', '2025-06-15 11:43:27', '2025-06-17 18:52:09'),
(2, 1, 2, 1, 'Rejected', '2025-06-15 11:45:34', '2025-06-17 23:34:09'),
(3, 1, 3, 1, 'Rejected', '2025-06-15 11:45:36', '2025-06-17 23:32:40'),
(4, 2, 3, 1, 'Rejected', '2025-06-15 11:45:57', '2025-06-17 23:32:40'),
(5, 2, 2, 1, 'Approved', '2025-06-15 11:45:58', '2025-06-17 22:55:26'),
(6, 2, 1, 1, 'Rejected', '2025-06-15 11:45:59', '2025-06-17 23:33:58'),
(7, 3, 3, 1, 'Approved', '2025-06-15 11:46:18', '2025-06-17 23:32:40'),
(8, 3, 2, 1, 'Rejected', '2025-06-15 11:46:19', '2025-06-17 23:33:47'),
(9, 3, 1, 1, 'Rejected', '2025-06-15 11:46:20', '2025-06-17 23:33:30'),
(10, 1, 4, 1, 'Approved', '2025-06-18 23:41:25', '2025-06-18 23:53:48'),
(12, 2, 5, 1, 'Approved', '2025-06-19 03:34:39', '2025-06-19 03:35:02'),
(13, 2, 6, 1, 'Approved', '2025-06-19 03:38:19', '2025-06-19 03:38:37');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_caregiver_kyc`
--

CREATE TABLE `tbl_caregiver_kyc` (
  `id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `home_address` varchar(255) NOT NULL,
  `nin` varchar(20) NOT NULL,
  `id_card_path` varchar(255) NOT NULL,
  `proof_of_address_path` varchar(255) NOT NULL,
  `guarantor1_name` varchar(100) NOT NULL,
  `guarantor1_phone` varchar(20) NOT NULL,
  `guarantor1_email` varchar(100) DEFAULT NULL,
  `guarantor1_relationship` varchar(50) NOT NULL,
  `guarantor1_document_path` varchar(255) DEFAULT NULL,
  `guarantor2_name` varchar(100) NOT NULL,
  `guarantor2_phone` varchar(20) NOT NULL,
  `guarantor2_email` varchar(100) DEFAULT NULL,
  `guarantor2_relationship` varchar(50) NOT NULL,
  `guarantor2_document_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_caregiver_kyc`
--

INSERT INTO `tbl_caregiver_kyc` (`id`, `caregiver_id`, `home_address`, `nin`, `id_card_path`, `proof_of_address_path`, `guarantor1_name`, `guarantor1_phone`, `guarantor1_email`, `guarantor1_relationship`, `guarantor1_document_path`, `guarantor2_name`, `guarantor2_phone`, `guarantor2_email`, `guarantor2_relationship`, `guarantor2_document_path`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 1, '4 Adeleke Ige street, Orimedu, Ita-Oluwo', '2223344112', 'id_card-1749990885271-449688341.jpg', 'proof_of_address-1749990885294-625754722.jpg', 'Dorcas Oluwaseun Oladotun', '08111418212', 'Dorcas@gmail.com', 'Mother', 'guarantor1_doc-1749990885319-373090452.jpg', 'Oladotun Pius', '09061563886', 'pius@gmail.com', 'Brother', 'guarantor2_doc-1749990885332-453707998.jpg', 'Approved', NULL, '2025-06-15 12:34:45', '2025-06-15 18:20:51'),
(2, 2, '4 adeleke ige street, orimedu, ita oluwo', '2223344112', 'id_card-1750013917964-672601801.jpg', 'proof_of_address-1750013917991-424054020.jpg', 'Oladotun Francis', '080159227696', 'oladotunfrancisadedayo121@gmail.com', 'Brother', 'guarantor1_doc-1750013918026-263301076.jpg', 'francis', '08059227696', 'francismax44@gmail.com', 'Brother', 'guarantor2_doc-1750013918085-195237651.jpg', 'Approved', NULL, '2025-06-15 18:10:27', '2025-06-15 19:23:23');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_caregiver_requests`
--

CREATE TABLE `tbl_caregiver_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service` varchar(255) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `age_group` varchar(100) DEFAULT NULL,
  `address` text NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Open',
  `offer_amount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_caregiver_requests`
--

INSERT INTO `tbl_caregiver_requests` (`id`, `user_id`, `service`, `duration`, `age_group`, `address`, `notes`, `created_at`, `status`, `offer_amount`) VALUES
(1, 1, 'elder', '6 hours per day', '60-70 years', 'Surulere', 'Must be a christian', '2025-06-15 11:43:03', 'Close', 0),
(2, 2, 'nanny', '3 hours per day', '3-5 years', 'Maryland', 'Must be living in Lagos', '2025-06-15 11:44:18', 'Close', 0),
(3, 3, 'househelp', 'Weekends only', NULL, 'Victoria Island', 'Age range 27 - 35', '2025-06-15 11:45:24', 'Close', 0),
(4, 1, 'Nanny', '6 hours per day', '6-12 months', 'Victoria Island', 'Must stay in Lagos', '2025-06-18 23:34:13', 'Close', 6500),
(5, 3, 'Nanny', '6 hours per day', '3-5 years', 'Surulere', 'Must be a christian', '2025-06-19 03:34:04', 'Close', 7000),
(6, 2, 'Nanny', '6 hours per day', '6-12 months', 'Ajah', 'Must be a muslim', '2025-06-19 03:38:04', 'Close', 6000);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_caregiver_reviews`
--

CREATE TABLE `tbl_caregiver_reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `caregiver_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_caregiver_reviews`
--

INSERT INTO `tbl_caregiver_reviews` (`id`, `user_id`, `caregiver_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 1, 5, 'She is so nice', '2025-06-17 19:46:10'),
(2, 2, 2, 5, 'Nice Job', '2025-06-17 22:55:48'),
(3, 3, 3, 5, 'Very Polite', '2025-06-17 23:44:43');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_meet_founder`
--

CREATE TABLE `tbl_meet_founder` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `founder_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_meet_founder`
--

INSERT INTO `tbl_meet_founder` (`id`, `title`, `content`, `founder_image`, `created_at`) VALUES
(1, 'Meet our Founders', 'Behind Thrivemama Care are passionate parents, caregivers, and advocates who believe that support during life’s most delicate seasons should be accessible and trustworthy. Our leadership brings experience from caregiving, healthcare, and technology — with one shared goal: making caregiving more human.', '1750126312340-woman-3.jpeg', '2025-06-17 02:11:52');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_notifications`
--

CREATE TABLE `tbl_notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('user','caregiver','admin') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_notifications`
--

INSERT INTO `tbl_notifications` (`id`, `user_id`, `user_type`, `message`, `is_read`, `type`, `created_at`) VALUES
(1, 1, 'user', 'You have a new service request from Mr. Adebayo.', 1, 'New Service Request', '2025-06-18 10:35:27');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_our_story`
--

CREATE TABLE `tbl_our_story` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `story_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_our_story`
--

INSERT INTO `tbl_our_story` (`id`, `title`, `content`, `story_image`, `created_at`) VALUES
(1, 'Our Story', 'ThrivemamaCare was born out of a simple, heartfelt need — the desire to help families thrive through personalized, compassionate caregiving. After experiencing the challenges of finding trusted support during motherhood and caregiving transitions, our founders envisioned a solution that puts care, safety, and dignity at the center of family support.\r\n\r\nWe set out to build more than just a caregiver marketplace — we’re building a movement for holistic family care.', '1750126538526-image-1.jpeg', '2025-06-17 02:15:38');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

CREATE TABLE `tbl_payment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('user','caregiver') NOT NULL,
  `email` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(10) DEFAULT 'NGN',
  `reference` varchar(100) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_payment`
--

INSERT INTO `tbl_payment` (`id`, `user_id`, `user_type`, `email`, `amount`, `currency`, `reference`, `status`, `paid_at`, `created_at`) VALUES
(1, 1, 'user', 'francismax44@gmail.com', 700000, 'NGN', '22152199', 'success', '2025-06-17 13:37:35', '2025-06-17 12:37:36'),
(2, 2, 'caregiver', 'caregiver2@gmail.com', 800000, 'NGN', '68394400', 'success', '2025-06-17 13:45:59', '2025-06-17 12:46:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payments`
--

CREATE TABLE `tbl_payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'NGN',
  `reference` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `appointment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_payments`
--

INSERT INTO `tbl_payments` (`id`, `user_id`, `user_type`, `email`, `amount`, `currency`, `reference`, `status`, `paid_at`, `appointment_id`, `created_at`) VALUES
(1, 1, 'user', 'user1@gmail.com', 6500.00, 'NGN', 'APP-1750303904052-805', 'success', '2025-06-19 03:31:51', 1, '2025-06-19 03:31:51'),
(2, 3, 'user', 'user3@gmail.com', 7000.00, 'NGN', 'APP-1750304122674-780', 'success', '2025-06-19 03:35:29', 2, '2025-06-19 03:35:29'),
(3, 2, 'user', 'user2@gmail.com', 6000.00, 'NGN', 'APP-1750304335286-924', 'success', '2025-06-19 03:39:03', 3, '2025-06-19 03:39:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reviews`
--

CREATE TABLE `tbl_reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('user','caregiver') NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `review` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reviews`
--

INSERT INTO `tbl_reviews` (`id`, `user_id`, `user_type`, `name`, `review`, `rating`, `is_approved`, `created_at`) VALUES
(1, 1, 'user', 'Johnson Oluwatunmise', '\"I’ve never felt more at ease! The caregiver I found through this platform is incredible. They truly go above and beyond.\"', 5, 1, '2025-06-17 02:51:59'),
(2, 2, 'user', 'Abubakar Aishat', '\"This service has been amazing! The caregivers are professional, caring, and reliable. I feel confident leaving my child in their hands. Highly recommend!\"', 5, 1, '2025-06-17 03:09:02'),
(3, 1, 'caregiver', 'Sarah Peter', '\"The ease of finding quality caregivers is unmatched. The platform is so user-friendly, and the caregivers are top-notch!\"', 4, 1, '2025-06-17 03:09:50');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_social_links`
--

CREATE TABLE `tbl_social_links` (
  `id` int(11) NOT NULL,
  `platform` varchar(100) NOT NULL,
  `url` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_social_links`
--

INSERT INTO `tbl_social_links` (`id`, `platform`, `url`, `created_at`, `updated_at`) VALUES
(1, 'Facebook', 'https://facebook.com/dahyor', '2025-06-12 00:57:10', '2025-06-12 01:16:49'),
(2, 'Instagram', 'https://instagram.com/dahyor', '2025-06-12 00:58:10', '2025-06-12 01:17:02'),
(3, 'X', 'https://x.com/dahyor_tweet', '2025-06-12 01:00:11', '2025-06-12 01:08:00'),
(4, 'LinkedIn', 'www.linkedln/myprofile', '2025-06-12 01:17:14', '2025-06-12 01:17:14');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_support_messages`
--

CREATE TABLE `tbl_support_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_support_messages`
--

INSERT INTO `tbl_support_messages` (`id`, `ticket_id`, `sender_id`, `sender_type`, `message`, `created_at`) VALUES
(1, 1, 1, 'user', 'Whenever I try to update my profile picture, I get a server error.', '2025-06-16 13:57:40'),
(2, 2, 2, 'caregiver', 'Whenever I try to update my KYC, I get a server error.', '2025-06-16 13:58:24'),
(3, 3, 1, 'user', 'I did mistake while registering, now i want to change my gender from female to male', '2025-06-16 14:09:26'),
(4, 4, 1, 'user', 'I\'m stop receiving notification, i want to know why ?', '2025-06-16 14:14:08'),
(5, 5, 2, 'caregiver', 'Just testing, Lol.', '2025-06-16 14:34:05'),
(6, 1, 1, 'admin', 'Okay', '2025-06-16 15:51:53'),
(7, 3, 1, 'admin', 'okay', '2025-06-16 16:06:15'),
(8, 4, 1, 'admin', 'okay', '2025-06-16 16:07:40'),
(9, 1, 1, 'admin', 'Can i close the ticket now ?', '2025-06-16 19:08:55'),
(10, 1, 1, 'user', 'I\'m still waiting', '2025-06-16 19:10:12'),
(11, 1, 1, 'user', 'Okay, you can close the ticket now. Thank you', '2025-06-16 19:19:30'),
(12, 6, 2, 'caregiver', 'Just Testing...', '2025-06-16 19:23:38'),
(13, 7, 2, 'user', 'Just testing from users...', '2025-06-16 19:25:01'),
(14, 6, 1, 'admin', 'Okay', '2025-06-16 19:25:41'),
(15, 7, 1, 'admin', 'Okay', '2025-06-16 19:25:46'),
(16, 7, 2, 'user', 'Yeah', '2025-06-16 19:27:49'),
(17, 6, 2, 'caregiver', 'Yeah', '2025-06-16 19:29:08');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_support_tickets`
--

CREATE TABLE `tbl_support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `subject` text NOT NULL,
  `type` varchar(50) NOT NULL CHECK (`type` in ('Technical','Billing','Account','Others')),
  `status` varchar(20) NOT NULL DEFAULT 'Open' CHECK (`status` in ('Open','Resolved','Closed')),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_support_tickets`
--

INSERT INTO `tbl_support_tickets` (`id`, `user_id`, `user_type`, `subject`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'user', 'Unable to update profile', 'Technical', 'Open', '2025-06-16 13:57:40', '2025-06-16 13:57:40'),
(2, 2, 'caregiver', 'Unable to update KYC', 'Technical', 'Open', '2025-06-16 13:58:24', '2025-06-16 13:58:24'),
(3, 1, 'user', 'Gender Mistake', 'Account', 'Open', '2025-06-16 14:09:26', '2025-06-16 14:09:26'),
(4, 1, 'user', 'Notification', 'Technical', 'Open', '2025-06-16 14:14:08', '2025-06-16 14:14:08'),
(5, 2, 'caregiver', 'Hello', 'Others', 'Resolved', '2025-06-16 14:34:05', '2025-06-16 14:34:05'),
(6, 2, 'caregiver', 'Just Testing', 'Billing', 'Open', '2025-06-16 19:23:38', '2025-06-16 19:23:38'),
(7, 2, 'user', 'Just Testing', 'Billing', 'Open', '2025-06-16 19:25:01', '2025-06-16 19:25:01');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `phone`, `gender`, `address`, `password`, `created_at`, `profile_image`) VALUES
(1, 'user 1', 'user1@gmail.com', '080123456789', 'female', 'Ketu', '$2b$10$pfTlpOY7SDxjWqYXCfJAnumb5hXU.DOYZeOlnCja.n8Mbn2Ude8fG', '2025-06-15 11:39:50', '1750133483038-woman-1.jpeg'),
(2, 'user 2', 'user2@gmail.com', '080123456789', 'female', 'Lagos Island', '$2b$10$CdSQz/4.GQ10rylZqcOaY.edYm4ZBCnpbPxK46/I32yORRE/W9eWy', '2025-06-15 11:40:15', '1750133540693-woman-2.jpeg'),
(3, 'user3', 'user3@gmail.com', '080123456789', 'female', NULL, '$2b$10$WXmbsFhCvR3gC3jpc/T76e6jhBi.nOBXi3aMMLFrjmkf8Sk5BDmqu', '2025-06-15 11:40:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_waiting_list`
--

CREATE TABLE `tbl_waiting_list` (
  `id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_waiting_list`
--

INSERT INTO `tbl_waiting_list` (`id`, `name`, `email`, `created_at`) VALUES
(1, 'Francis Test', 'francis@example.com', '2025-05-29 03:09:43'),
(2, 'Oladotun Francis', 'oladotunfrancisadedayo121@gmail.com', '2025-05-29 03:10:04'),
(3, 'steven', 'francismax44@gmail.com', '2025-05-29 03:26:07'),
(4, 'steven', 'Oladotunfrancis44@gmail.com', '2025-05-29 03:28:07'),
(5, 'Adedayo Oladotun', 'oladotunfrancisadedayo121@gmail.com', '2025-05-29 03:34:39'),
(6, 'Oladotun Francis', 'Oladotunfrancis44@gmail.com', '2025-05-29 03:52:13'),
(7, 'Oladotun Francis', 'francismax44@gmail.com', '2025-05-29 03:55:41'),
(8, 'Francis Oladotun', 'francismax44@gmail.com', '2025-06-11 13:15:29'),
(9, 'Francis Oladotun', 'francismax44@gmail.com', '2025-06-11 13:15:31'),
(10, 'Francis Oladotun', 'francismax44@gmail.com', '2025-06-11 13:15:37'),
(11, 'Francis Oladotun', 'francismax44@gmail.com', '2025-06-11 13:15:38'),
(12, 'Francis Oladotun', 'francismax@gmail.com', '2025-06-11 13:17:39');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_website_identity`
--

CREATE TABLE `tbl_website_identity` (
  `id` int(11) NOT NULL,
  `site_name` varchar(255) NOT NULL,
  `caption` varchar(225) NOT NULL,
  `tagline` varchar(225) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `banner1` varchar(255) DEFAULT NULL,
  `banner2` varchar(255) DEFAULT NULL,
  `banner3` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_website_identity`
--

INSERT INTO `tbl_website_identity` (`id`, `site_name`, `caption`, `tagline`, `logo`, `banner1`, `banner2`, `banner3`, `created_at`, `updated_at`) VALUES
(1, 'ThriveMama care', 'Connecting Families with Trusted Caregivers', 'ThriveMama simplifies your search for the perfect caregiver. Whether you\'re a parent in need or a nanny offering support, we make finding the right connection fast, reliable, and safe.', '1749747690802-Thrivemam.png', '1749747690804-image-1.jpeg', '1749747690817-image-2.jpeg', '1749747690817-image-3.jpeg', '2025-06-12 16:36:09', '2025-06-17 00:59:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_about_us`
--
ALTER TABLE `tbl_about_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_admins`
--
ALTER TABLE `tbl_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_appointments`
--
ALTER TABLE `tbl_appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_caregivers`
--
ALTER TABLE `tbl_caregivers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_caregiver_interests`
--
ALTER TABLE `tbl_caregiver_interests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_interest` (`caregiver_id`,`request_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `tbl_caregiver_kyc`
--
ALTER TABLE `tbl_caregiver_kyc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `caregiver_id` (`caregiver_id`);

--
-- Indexes for table `tbl_caregiver_requests`
--
ALTER TABLE `tbl_caregiver_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_caregiver_reviews`
--
ALTER TABLE `tbl_caregiver_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_meet_founder`
--
ALTER TABLE `tbl_meet_founder`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_our_story`
--
ALTER TABLE `tbl_our_story`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`);

--
-- Indexes for table `tbl_payments`
--
ALTER TABLE `tbl_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`);

--
-- Indexes for table `tbl_reviews`
--
ALTER TABLE `tbl_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_social_links`
--
ALTER TABLE `tbl_social_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_support_messages`
--
ALTER TABLE `tbl_support_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_support_tickets`
--
ALTER TABLE `tbl_support_tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tbl_waiting_list`
--
ALTER TABLE `tbl_waiting_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_website_identity`
--
ALTER TABLE `tbl_website_identity`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_about_us`
--
ALTER TABLE `tbl_about_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_admins`
--
ALTER TABLE `tbl_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_appointments`
--
ALTER TABLE `tbl_appointments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_caregivers`
--
ALTER TABLE `tbl_caregivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_caregiver_interests`
--
ALTER TABLE `tbl_caregiver_interests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_caregiver_kyc`
--
ALTER TABLE `tbl_caregiver_kyc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_caregiver_requests`
--
ALTER TABLE `tbl_caregiver_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_caregiver_reviews`
--
ALTER TABLE `tbl_caregiver_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_meet_founder`
--
ALTER TABLE `tbl_meet_founder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_notifications`
--
ALTER TABLE `tbl_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_our_story`
--
ALTER TABLE `tbl_our_story`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_payments`
--
ALTER TABLE `tbl_payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_reviews`
--
ALTER TABLE `tbl_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_social_links`
--
ALTER TABLE `tbl_social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_support_messages`
--
ALTER TABLE `tbl_support_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_support_tickets`
--
ALTER TABLE `tbl_support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_waiting_list`
--
ALTER TABLE `tbl_waiting_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_website_identity`
--
ALTER TABLE `tbl_website_identity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_caregiver_interests`
--
ALTER TABLE `tbl_caregiver_interests`
  ADD CONSTRAINT `tbl_caregiver_interests_ibfk_1` FOREIGN KEY (`caregiver_id`) REFERENCES `tbl_users` (`id`),
  ADD CONSTRAINT `tbl_caregiver_interests_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `tbl_caregiver_requests` (`id`);

--
-- Constraints for table `tbl_caregiver_kyc`
--
ALTER TABLE `tbl_caregiver_kyc`
  ADD CONSTRAINT `tbl_caregiver_kyc_ibfk_1` FOREIGN KEY (`caregiver_id`) REFERENCES `tbl_caregivers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
