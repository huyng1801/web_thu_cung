const fs = require('fs');

const getImageBase64 = async (imagePath) => {
  return new Promise((resolve, reject) => {
    // Kiểm tra xem đường dẫn hình ảnh có tồn tại không
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Nếu đường dẫn không tồn tại, trả về chuỗi rỗng
        resolve('');
      } else {
        // Nếu đường dẫn tồn tại, tiến hành đọc và chuyển đổi thành base64
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            // Chuyển đổi dữ liệu đọc được thành chuỗi base64
            const base64Image = Buffer.from(data).toString('base64');
            resolve(base64Image);
          }
        });
      }
    });
  });
};

module.exports = {
  getImageBase64
};
