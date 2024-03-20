const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const config = require('../config/dbConfig');

const userController = {
  /**
   * @desc    Lấy danh sách tất cả người dùng
   * @route   GET /api/users
   * @access  Public
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách người dùng.' });
    }
  },

  /**
   * @desc    Lấy thông tin của một người dùng theo ID
   * @route   GET /api/users/:user_id
   * @access  Public
   */
  getUserById: async (req, res) => {
    const { user_id } = req.params;
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin người dùng.' });
    }
  },

  /**
   * @desc    Thêm một người dùng mới
   * @route   POST /api/users
   * @access  Public
   */
  addUser: async (req, res) => {
    const { user_id, user_name, email, phone_number, password } = req.body;
    try {
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const newUser = await User.create({ user_id, user_name, email, phone_number, password: hashedPassword });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Lỗi khi thêm người dùng mới:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm người dùng mới.' });
    }
  },

  /**
   * @desc    Cập nhật thông tin của một người dùng
   * @route   PUT /api/users/:user_id
   * @access  Public
   */
  updateUser: async (req, res) => {
    const { user_id } = req.params;
    const { user_name, email, phone_number, password } = req.body;
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }

      // Mã hóa mật khẩu nếu được cung cấp
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      user.user_name = user_name || user.user_name;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;

      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
    }
  },

  /**
   * @desc    Xóa một người dùng
   * @route   DELETE /api/users/:user_id
   * @access  Public
   */
  deleteUser: async (req, res) => {
    const { user_id } = req.params;
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
      }
      await user.destroy();
      res.json({ message: 'Xóa người dùng thành công.' });
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa người dùng.' });
    }
  },
  /**
   * @desc    Đăng nhập người dùng
   * @route   POST /api/users/login
   * @access  Public
   */
  loginUser: async (req, res) => {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Tìm người dùng trong cơ sở dữ liệu bằng email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng.' });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Email hoặc mật khẩu không đúng.' });
      }

      // Tạo và trả về token JWT
      const payload = {
        user: {
          id: user.user_id
        }
      };

      jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error('Lỗi khi đăng nhập người dùng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập người dùng.' });
    }
  },
   /**
   * @desc    Đổi mật khẩu của người dùng
   * @route   POST /api/users/change-password
   * @access  Private (requires token authentication)
   */
   changePassword: async (req, res) => {
    // Validate request body (new password, current password)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming the user ID is attached to the request object after authentication

    try {
      // Find user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Check if current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }

      // Hash and update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'An error occurred while changing the password.' });
    }
  },

  /**
   * @desc    Cập nhật thông tin của người dùng
   * @route   PUT /api/users/update-profile
   * @access  Private (requires token authentication)
   */
  updateProfile: async (req, res) => {
    // Validate request body (user name, email, phone number)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, email, phoneNumber } = req.body;
    const userId = req.user.id; // Assuming the user ID is attached to the request object after authentication

    try {
      // Find user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Update user information
      user.user_name = userName || user.user_name;
      user.email = email || user.email;
      user.phone_number = phoneNumber || user.phone_number;
      await user.save();

      res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'An error occurred while updating the profile.' });
    }
  }
};

module.exports = userController;
