// server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Port mặc định là 3000 hoặc lấy từ môi trường nếu có

// Import các tệp routes
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoutes');
const customerRoutes = require('./src/routes/customerRoutes'); // Đã thêm route cho khách hàng
// Sử dụng middleware để cho phép đọc dữ liệu từ body của request
app.use(express.json());
app.use(cors());
// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
// Sử dụng các tuyến đã được định nghĩa
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderDetailRoutes); // Sử dụng route cho chi tiết đơn hàng
app.use('/api', customerRoutes); // Sử dụng route cho khách hàng
// Kết nối với cơ sở dữ liệu
const db = require('./src/config/dbConfig');

// Khởi chạy máy chủ
db.sync()
  .then(() => {
    console.log('Cơ sở dữ liệu đã được kết nối.');
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Lỗi khi kết nối cơ sở dữ liệu:', err);
  });
