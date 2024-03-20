// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @desc    Lấy danh sách tất cả các danh mục
 * @route   GET /api/categories
 * @access  Public
 */
router.get('/categories', categoryController.getAllCategories);

/**
 * @desc    Thêm một danh mục mới
 * @route   POST /api/categories
 * @access  Public
 */
router.post('/categories', categoryController.addCategory);

/**
 * @desc    Sửa thông tin của một danh mục
 * @route   PUT /api/categories/:category_id
 * @access  Public
 */
router.put('/categories/:category_id', categoryController.updateCategory);

/**
 * @desc    Xóa một danh mục
 * @route   DELETE /api/categories/:category_id
 * @access  Public
 */
router.delete('/categories/:category_id', categoryController.deleteCategory);
/**
 * @desc    Lấy danh sách các danh mục có sản phẩm
 * @route   GET /api/categories/with-products
 * @access  Public
 */
router.get('/categories/with-products', categoryController.getCategoriesWithProducts);

module.exports = router;
