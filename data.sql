-- Tạo bảng users
CREATE TABLE users (
    user_id VARCHAR(20)  PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    password VARCHAR(200) NOT NULL
);

-- Tạo bảng categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- Tạo bảng products
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    image_link TEXT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Tạo bảng customers
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone_number VARCHAR(15),
    address TEXT,
    city VARCHAR(50),
    password VARCHAR(200) NOT NULL
);

-- Tạo bảng orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    status VARCHAR(50),
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Tạo bảng order_details
CREATE TABLE order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    sale_price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE, 
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
-- Chèn dữ liệu vào bảng users
INSERT INTO users (user_id, user_name, email, phone_number, password) 
VALUES 
('nguoidung001', 'Nguyễn Văn A', 'nguyenvana@example.com', '0987654321', 'matkhau123'),
('nguoidung002', 'Trần Thị B', 'tranthib@example.com', '0123456789', 'matkhau456'),
('nguoidung003', 'Lê Đức C', 'leducc@example.com', '0369852471', 'matkhau789');

-- Chèn dữ liệu vào bảng categories
INSERT INTO categories (category_name) 
VALUES 
('Điện tử'),
('Thời trang'),
('Sách');

-- Chèn dữ liệu vào bảng products
INSERT INTO products (product_name, description, price, stock_quantity, image_link, category_id) 
VALUES 
('Điện thoại thông minh', 'Mẫu điện thoại mới nhất với các tính năng tiên tiến.', 1000000, 50, 'link_anh_dien_thoai', 1),
('Áo thun', 'Áo thun cotton thoải mái có sẵn trong các màu sắc và kích thước.', 200000, 100, 'link_anh_ao_thun', 2),
('Sách lập trình Python', 'Hướng dẫn toàn diện để học ngôn ngữ lập trình Python.', 300000, 30, 'link_anh_sach_python', 3);

-- Chèn dữ liệu vào bảng customers
INSERT INTO customers (full_name, email, phone_number, address, city, password) 
VALUES 
('Nguyễn Thị X', 'nguyenthix@example.com', '0987654321', '123 Đường ABC', 'Hà Nội', 'khachhang_matkhau123'),
('Trần Văn Y', 'tranvany@example.com', '0123456789', '456 Đường XYZ', 'Hồ Chí Minh', 'khachhang_matkhau456');

-- Chèn dữ liệu vào bảng orders với order_date từ tháng 1 đến tháng 12 năm 2024
INSERT INTO orders (order_date, note, status, customer_id) 
VALUES 
('2024-01-15 10:30:00', 'Đơn hàng tháng 1', 'Hoàn tất', 1),
('2024-02-20 09:45:00', 'Đơn hàng tháng 2', 'Hoàn tất', 2),
('2024-03-05 11:20:00', 'Đơn hàng tháng 3', 'Hoàn tấ', 1);

-- Dựa vào các order_id ở trên để phù hợp với đơn hàng
INSERT INTO order_details (order_id, product_id, quantity, sale_price) 
VALUES 
(1, 1, 2, 2000000),
(1, 2, 3, 600000),
(2, 3, 1, 300000),
(2, 1, 1, 1000000),
(3, 2, 2, 400000),
(3, 3, 2, 600000);