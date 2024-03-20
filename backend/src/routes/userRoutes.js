// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');

/**
 * @desc    Lấy danh sách tất cả người dùng
 * @route   GET /api/users
 * @access  Public
 */
router.get('/users', userController.getAllUsers);

/**
 * @desc    Lấy thông tin của một người dùng theo ID
 * @route   GET /api/users/:user_id
 * @access  Public
 */
router.get('/users/:user_id', userController.getUserById);

/**
 * @desc    Thêm một người dùng mới
 * @route   POST /api/users
 * @access  Public
 */
router.post(
  '/users',
  [
    check('email', 'Vui lòng nhập một địa chỉ email hợp lệ.').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự.').isLength({ min: 6 })
  ],
  userController.addUser
);

/**
 * @desc    Cập nhật thông tin của một người dùng
 * @route   PUT /api/users/:user_id
 * @access  Public
 */
router.put('/users/:user_id', userController.updateUser);

/**
 * @desc    Xóa một người dùng
 * @route   DELETE /api/users/:user_id
 * @access  Public
 */
router.delete('/users/:user_id', userController.deleteUser);

/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/users/login
 * @access  Public
 */
router.post(
  '/users/login',
  [
    check('email', 'Vui lòng nhập một địa chỉ email hợp lệ.').isEmail(),
    check('password', 'Mật khẩu không được để trống.').notEmpty()
  ],
  userController.loginUser
);
/**
 * @desc    Đổi mật khẩu của người dùng
 * @route   POST /api/users/change-password
 * @access  Private (requires token authentication)
 */
router.post(
  '/users/change-password',
  [
    // Validate request body (current password, new password)
    check('currentPassword', 'Mật khẩu hiện tại không được để trống.').notEmpty(),
    check('newPassword', 'Mật khẩu mới phải có ít nhất 6 ký tự.').isLength({ min: 6 })
  ],
  userController.changePassword
);

/**
 * @desc    Cập nhật thông tin của người dùng
 * @route   PUT /api/users/update-profile
 * @access  Private (requires token authentication)
 */
router.put(
  '/users/update-profile',
  [
    // Validate request body (user name, email, phone number)
    check('userName', 'Vui lòng nhập tên người dùng.').notEmpty(),
    check('email', 'Vui lòng nhập một địa chỉ email hợp lệ.').isEmail(),
    check('phoneNumber', 'Vui lòng nhập số điện thoại hợp lệ.').isMobilePhone()
  ],
  userController.updateProfile
);
module.exports = router;
