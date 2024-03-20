const Category = require('../models/category');
const Product = require('../models/product');
const categoryController = {
  /**
   * @desc    Lấy danh sách tất cả các danh mục
   * @route   GET /api/categories
   * @access  Public
   */
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách danh mục.' });
    }
  },

  /**
   * @desc    Thêm một danh mục mới
   * @route   POST /api/categories
   * @access  Public
   */
  addCategory: async (req, res) => {
    const { category_name } = req.body;
    try {
      const newCategory = await Category.create({ category_name });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Lỗi khi thêm danh mục mới:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm danh mục mới.' });
    }
  },

  /**
   * @desc    Sửa thông tin của một danh mục
   * @route   PUT /api/categories/:category_id
   * @access  Public
   */
  updateCategory: async (req, res) => {
    const { category_id } = req.params;
    const { category_name } = req.body;
    try {
      const updatedCategory = await Category.findByPk(category_id);
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
      }
      updatedCategory.category_name = category_name;
      await updatedCategory.save();
      res.json(updatedCategory);
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật danh mục.' });
    }
  },

  /**
   * @desc    Xóa một danh mục
   * @route   DELETE /api/categories/:category_id
   * @access  Public
   */
  deleteCategory: async (req, res) => {
    const { category_id } = req.params;
    try {
      const deletedCategory = await Category.findByPk(category_id);
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
      }
      await deletedCategory.destroy();
      res.json({ message: 'Xóa danh mục thành công.' });
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa danh mục.' });
    }
  },
   /**
   * @desc    Lấy danh sách các danh mục có sản phẩm
   * @route   GET /api/categories/with-products
   * @access  Public
   */
   getCategoriesWithProducts: async (req, res) => {
    try {
      // Lấy danh sách tất cả các danh mục
      const categories = await Category.findAll();

      // Kiểm tra nếu không có danh mục nào
      if (!categories || categories.length === 0) {
        return res.status(404).json({ error: 'Không có danh mục nào trong cơ sở dữ liệu.' });
      }

      // Lặp qua từng danh mục để kiểm tra xem có sản phẩm nào thuộc về nó không
      const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
        const categoryId = category.category_id;

        // Lấy số lượng sản phẩm thuộc về danh mục này
        const productCount = await Product.count({ where: { category_id: categoryId } });

        // Nếu có ít nhất một sản phẩm thuộc về danh mục này, trả về danh mục
        if (productCount > 0) {
          return {
            category_id: categoryId,
            category_name: category.category_name
          };
        }

        // Nếu không có sản phẩm nào thuộc về danh mục này, trả về null
        return null;
      }));

      // Loại bỏ các danh mục không có sản phẩm
      const filteredCategories = categoriesWithProducts.filter(category => category !== null);

      // Trả về danh sách các danh mục có sản phẩm
      res.json(filteredCategories);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục có sản phẩm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách danh mục có sản phẩm.' });
    }
  }
};

module.exports = categoryController;
