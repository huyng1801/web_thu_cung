// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
/**
 * @desc    Lấy danh sách tất cả sản phẩm
 * @route   GET /api/products
 * @access  Public
 */
router.get('/products', productController.getAllProducts);

/**
 * @desc    Lấy thông tin của một sản phẩm theo ID
 * @route   GET /api/products/:product_id
 * @access  Public
 */
router.get('/products/:product_id', productController.getProductById);

/**
 * @desc    Thêm một sản phẩm mới
 * @route   POST /api/products
 * @access  Public
 */
router.post('/products', upload.single('image'), productController.addProduct);

/**
 * @desc    Cập nhật thông tin của một sản phẩm
 * @route   PUT /api/products/:product_id
 * @access  Public
 */
router.put('/products/:product_id', upload.single('image'), productController.updateProduct);


/**
 * @desc    Xóa một sản phẩm
 * @route   DELETE /api/products/:product_id
 * @access  Public
 */
router.delete('/products/:product_id', productController.deleteProduct);
/**
 * @desc    Lấy danh sách sản phẩm theo category_id
 * @route   GET /api/products/category/:category_id
 * @access  Public
 */
router.get('/products/category/:category_id', productController.getProductsByCategory);
/**
 * @desc    Tìm kiếm sản phẩm theo tên
 * @route   GET /api/products/search/:search_query
 * @access  Public
 */
router.get('/products/search/:search_query', productController.searchProductsByName);
/**
 * @desc    Lấy danh sách sản phẩm của tất cả các danh mục
 * @route   GET /api/categories/products
 * @access  Public
 */
router.get('/categories/products', productController.getCategoryWithProducts);

module.exports = router;
