const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
// Thay các giá trị bên dưới bằng thông tin kết nối của cơ sở dữ liệu MySQL của bạn
const sequelize = new Sequelize('web_thu_cung', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Test kết nối
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối cơ sở dữ liệu thành công.');
  })
  .catch(err => {
    console.error('Không thể kết nối cơ sở dữ liệu:', err);
  });

module.exports = sequelize;
