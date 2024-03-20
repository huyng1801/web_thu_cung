const multer = require('multer');

// Cấu hình để lưu trữ hình ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Tạo middleware multer
const upload = multer({ storage: storage });

module.exports = upload;
