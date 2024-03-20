// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
/**
 * @desc    Lấy danh sách khách hàng
 * @route   GET /api/customers
 * @access  Private
 */
router.get('/customers', customerController.getCustomers);
/**
 * @desc    Đăng ký một tài khoản khách hàng mới
 * @route   POST /api/customers/register
 * @access  Public
 */
router.post('/customers/register', customerController.register);

/**
 * @desc    Đăng nhập tài khoản khách hàng
 * @route   POST /api/customers/login
 * @access  Public
 */
router.post('/customers/login', customerController.login);

/**
 * @desc    Sửa thông tin của khách hàng
 * @route   PUT /api/customers/:customer_id
 * @access  Private
 */
router.put('/customers/:customer_id', customerController.updateInfo);

/**
 * @desc    Đổi mật khẩu của khách hàng
 * @route   PUT /api/customers/:customer_id/change_password
 * @access  Private
 */
router.put('/customers/:customer_id/change_password', customerController.changePassword);
/**
 * @desc    Lấy danh sách đơn hàng của một khách hàng
 * @route   GET /api/customers/:customer_id/orders
 * @access  Public
 */
router.get('/customers/:customer_id/orders', customerController.getOrdersByCustomer);
module.exports = router;
