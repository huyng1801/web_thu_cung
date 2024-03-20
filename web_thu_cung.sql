-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 13, 2024 at 06:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_thu_cung`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(3, 'Phụ kiện'),
(1, 'Thức ăn cho chó'),
(2, 'Thức ăn cho mèo'),
(22, 'Đồ chơi');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(320) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `full_name`, `email`, `phone_number`, `address`, `city`, `password`) VALUES
(1, 'Nguyễn Thị X', 'nguyenthix@example.com', '0987654321', '123 Đường ABC', 'Hà Nội', 'khachhang_matkhau123'),
(2, 'Trần Văn Y', 'tranvany@example.com', '0123456789', '456 Đường XYZ', 'Hồ Chí Minh', 'khachhang_matkhau456'),
(5, 'New Full Name', 'example@example.com', 'New Phone Numbe', 'New Address', 'New City', '$2a$10$NSOtzdUE1ZI9qyqNYYt.hucV8N5dfitfGBK.uhyLwYR.evlUh/2Rq'),
(6, 'gdsfgsdf', '4@gmail.com', '4321', '4231', '4321', '$2a$10$qREOmR65kKye4oOkPRaSj.5oZLVzNqTJoMCej8EsAJT6FRj1NXznG'),
(7, '43243214321', '43214214@gmail.com', '4233421', '3422341', '43421432432234', '$2a$10$x13Q5fcfPXIFUneOPWtlJ.at59TYts86E12YBBnOeQUMK1PEayhIK'),
(8, 'abc', 'abc@gmail.com', '03412421421', 'xyz', 'TP.HCM', '$2a$10$opZOsp9lbcgMky915UacT.pNaLlcLA0B/LnjSi9.GDKV1Z/YS/sqy');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_date`, `note`, `status`, `customer_id`) VALUES
(1, '2024-03-08 10:00:00', 'Yêu cầu giao hàng gấp', 'Hoàn tất', 1),
(2, '2024-03-08 11:00:00', NULL, 'Chờ thanh toán', 2),
(3, '2024-03-08 10:01:32', 'Urgent delivery', 'Chờ xác nhận', 1),
(4, '2024-03-08 10:02:30', 'Urgent delivery', 'Hoàn tất', 1),
(5, '2024-01-15 10:30:00', 'Đơn hàng tháng 1', 'Hoàn tất', 1),
(6, '2024-02-20 09:45:00', 'Đơn hàng tháng 2', 'Hoàn tất', 2),
(7, '2024-03-05 11:20:00', 'Đơn hàng tháng 3', 'Hoàn tấ', 1),
(8, '2024-04-10 14:00:00', 'Đơn hàng tháng 4', 'Hoàn tấ', 2),
(9, '2024-05-18 08:00:00', 'Đơn hàng tháng 5', 'Hoàn tấ', 1),
(10, '2024-06-22 16:30:00', 'Đơn hàng tháng 6', 'Hoàn tấ', 2),
(11, '2024-07-03 10:15:00', 'Đơn hàng tháng 7', 'Hoàn tấ', 1),
(12, '2024-08-12 12:45:00', 'Đơn hàng tháng 8', 'Hoàn tấ', 2),
(13, '2024-09-25 13:20:00', 'Đơn hàng tháng 9', 'Hoàn tấ', 1),
(14, '2024-10-08 09:00:00', 'Đơn hàng tháng 10', 'Hoàn tấ', 2),
(15, '2024-11-14 15:10:00', 'Đơn hàng tháng 11', 'Hoàn tấ', 1),
(16, '2024-12-19 11:30:00', 'Đơn hàng tháng 12', 'Hoàn tấ', 2),
(17, '2024-03-12 06:29:49', '', 'Pending', 6),
(18, '2024-03-12 07:16:39', '', 'Pending', 6),
(19, '2024-03-12 07:16:52', '', 'Pending', 6),
(20, '2024-03-12 07:17:56', '', 'Pending', 6),
(21, '2024-03-12 07:20:31', 'Đơn hàng mới', 'Pending', 1),
(22, '2024-03-12 07:21:22', 'Đơn hàng mới', 'Pending', 1),
(23, '2024-03-12 07:21:50', 'Đơn hàng mới', 'Pending', 1),
(24, '2024-03-12 07:21:55', '', 'Pending', 6),
(25, '2024-03-12 08:31:38', '', 'Pending', 6),
(26, '2024-03-12 14:11:56', '', 'Pending', 8),
(27, '2024-03-12 14:22:50', '', 'Pending', 8);

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `order_detail_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `sale_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`order_detail_id`, `order_id`, `product_id`, `quantity`, `sale_price`) VALUES
(1, 1, 1, 2, 2000000),
(2, 1, 2, 3, 600000),
(3, 2, 3, 1, 300000),
(4, 3, 1, 2, 200000),
(5, 4, 2, 1, 200000),
(6, 3, 1, 2, 2000000),
(7, 3, 2, 3, 600000),
(8, 4, 3, 1, 300000),
(9, 5, 1, 1, 1000000),
(10, 5, 2, 2, 400000),
(11, 6, 3, 2, 600000),
(12, 7, 1, 3, 3000000),
(13, 8, 2, 1, 200000),
(14, 9, 3, 4, 1200000),
(15, 10, 1, 2, 2000000),
(16, 10, 2, 2, 400000),
(17, 11, 3, 3, 900000),
(18, 12, 1, 1, 1000000),
(19, 12, 2, 1, 200000),
(20, 23, 1, 2, 200000),
(21, 23, 2, 1, 200000),
(22, 24, 3, 3, 300000),
(23, 25, 3, 1, 300000),
(24, 25, 6, 1, 200000),
(25, 26, 6, 2, 200000),
(26, 27, 3, 5, 300000);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `image_link` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `description`, `price`, `stock_quantity`, `image_link`, `category_id`) VALUES
(1, 'Cá hồi que cho chó Bow wow 150g', 'Cá hồi que cho chó Bow wow 150g', 200000, 11, 'src\\uploads\\cahoiquechocho.jpg', 1),
(2, 'Phô mai thịt cừu cho chó bow wow 100g', 'Phô mai thịt cừu cho chó bow wow 100g', 200000, 100, 'src\\uploads\\bow-wow-pho-mai-thit-cuu-100g-1709195028080.webp', 3),
(3, 'Thức ăn cho mèo Puria Proplan Salmon', 'Thức ăn cho mèo Puria Proplan Salmon', 300000, 30, 'src\\uploads\\thuc-an-cho-meo-purina-pro-plan-savor-adult-salmon-rice-formula.jpg', 2),
(4, 'Kính Thời Trang Cho Chó', 'Kính Thời Trang Cho Chó', 100000, 11, 'src\\uploads\\images.jpg', 2),
(6, 'Áo thun không tay cho chó mèo', 'Áo thun không tay cho chó mèo', 200000, 11, 'src\\uploads\\3285a2b6967fb37e5dd07c6492e0942f.png_720x720q80.png', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(20) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(320) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `email`, `phone_number`, `password`) VALUES
('nguoidung001', 'Nguyễn Văn A1', 'nguyenvana@example.com', '0987654321', 'matkhau123'),
('nguoidung002', 'Trần Thị B', 'tranthib@example.com', '0123456789', 'matkhau456'),
('nguoidung003', 'Lê Đức C', 'leducc@example.com', '0369852471', 'matkhau789'),
('unique_user_id', 'new_user_name', 'newuser@example.com', '1234567890', '$2a$10$xMR9zvtSXhd6uEOaNsG6b.YJw41hEK7Gd7aSvhfrZ9CLCn3FGga1G');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `order_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
