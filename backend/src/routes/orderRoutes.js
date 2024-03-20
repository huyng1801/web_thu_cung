// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * @desc    Lấy danh sách tất cả các đơn hàng
 * @route   GET /api/orders
 * @access  Public
 */
router.get('/orders', orderController.getAllOrders);

/**
 * @desc    Lấy thông tin của một đơn hàng theo ID
 * @route   GET /api/orders/:order_id
 * @access  Public
 */
router.get('/orders/:order_id', orderController.getOrderById);

/**
 * @desc    Thêm một đơn hàng mới kèm theo chi tiết đơn hàng
 * @route   POST /api/orders
 * @access  Public
 */
router.post('/orders', orderController.addOrderWithDetails);

/**
 * @desc    Cập nhật thông tin của một đơn hàng
 * @route   PUT /api/orders/:order_id
 * @access  Public
 */
router.put('/orders/:order_id', orderController.updateOrder);

/**
 * @desc    Xóa một đơn hàng
 * @route   DELETE /api/orders/:order_id
 * @access  Public
 */
router.delete('/orders/:order_id', orderController.deleteOrder);

/**
 * @desc    Thống kê doanh thu cho tháng hiện tại
 * @route   GET /api/orders/revenue/current-month
 * @access  Public
 */
router.get('/orders/revenue/current-month', orderController.getRevenueCurrentMonth);

/**
 * @desc    Thống kê doanh thu cho các tháng trong năm
 * @route   GET /api/orders/revenue/yearly
 * @access  Public
 */
router.get('/orders/revenue/yearly', orderController.getRevenueYearly);


/**
 * @desc    Thống kê doanh thu trong mỗi ngày
 * @route   GET /api/orders/revenue/daily
 * @access  Public
 */
router.get('/orders/revenue/daily', orderController.getDailyRevenue);
module.exports = router;
