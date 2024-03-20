const jwt = require('jsonwebtoken');

// Cấu hình secret key cho JWT
const jwtSecret = 'your_jwt_secret_key';

module.exports = {
  jwtSecret: jwtSecret,
  
  // Tạo token JWT từ dữ liệu payload
  generateToken: (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Thời gian hết hạn: 1 giờ
  },

  // Xác thực token JWT và trả về dữ liệu payload nếu hợp lệ
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error) {
      return null; // Token không hợp lệ
    }
  }
};
