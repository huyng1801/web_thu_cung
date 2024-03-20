// routes/orderDetailRoutes.js
const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

/**
 * @desc    Lấy chi tiết của một đơn hàng dựa trên order_id
 * @route   GET /api/order-details/:order_id
 * @access  Public
 */
router.get('/order-details/:order_id', orderDetailController.getOrderDetailsByOrderId);

/**
 * @desc    Cập nhật thông tin của một chi tiết đơn hàng
 * @route   PUT /api/order-details/:order_detail_id
 * @access  Public
 */
router.put('/order-details/:order_detail_id', orderDetailController.updateOrderDetail);

/**
 * @desc    Xóa một chi tiết đơn hàng
 * @route   DELETE /api/order-details/:order_detail_id
 * @access  Public
 */
router.delete('/order-details/:order_detail_id', orderDetailController.deleteOrderDetail);

module.exports = router;
