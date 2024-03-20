const Product = require('../models/product');
const Category = require('../models/category');
const { getImageBase64 } = require('../middleware/getImageBase64');
const { Op } = require('sequelize');
const productController = {
  
  /**
   * @desc Lấy danh sách tất cả sản phẩm
   * @route GET /api/products
   * @access Public
   */
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
  
      // Lặp qua từng sản phẩm để đọc và chuyển đổi ảnh thành base64
      const productsWithBase64Images = await Promise.all(products.map(async (product) => {
        const base64Image = await getImageBase64(product.image_link);
        return {
          ...product.toJSON(),
          image_base64: "data:image/jpeg;base64," + base64Image
        };
      }));
  
      res.json(productsWithBase64Images);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm.' });
    }
  },

  /**
   * @desc Lấy thông tin của một sản phẩm theo ID
   * @route GET /api/products/:product_id
   * @access Public
   */
  getProductById: async (req, res) => {
    const { product_id } = req.params;
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      }

      // Chuyển đổi ảnh thành base64
      const base64Image = await getImageBase64(product.image_link);

      // Tạo đối tượng sản phẩm với dữ liệu base64 của ảnh
      const productWithBase64Image = {
        ...product.toJSON(),
        image_base64: "data:image/jpeg;base64," + base64Image
      };

      res.json(productWithBase64Image);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm.' });
    }
  },

  /**
   * @desc Thêm một sản phẩm mới
   * @route POST /api/products
   * @access Public
   */
  addProduct: async (req, res) => {
    const { product_name, description, price, stock_quantity, category_id } = req.body;
  
    try {
      // Check if the category_id is valid
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'Danh mục không hợp lệ.' });
      }
  
      // Check if the file exists in the request
      if (!req.file) {
        return res.status(400).json({ error: 'Hình ảnh sản phẩm không được cung cấp.' });
      }
  
      // Get the file path from the uploaded file
      const image_link = req.file.path;
  
      // Create a new product with the provided details
      const newProduct = await Product.create({ product_name, description, price, stock_quantity, image_link, category_id });
  
      // Send the newly created product as the response
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm mới:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm mới.' });
    }
  }
  ,

/**
 * @desc Cập nhật thông tin của một sản phẩm
 * @route PUT /api/products/:product_id
 * @access Public
 */
updateProduct: async (req, res) => {
  const { product_id } = req.params;
  const { product_name, description, price, stock_quantity, category_id } = req.body;
  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }

    // Kiểm tra xem category_id có hợp lệ không
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'Danh mục không hợp lệ.' });
      }
    }

    // Chỉ cập nhật file ảnh nếu có dữ liệu ảnh được cung cấp
    if (req.file) {
      product.image_link = req.file.path;
    }

    product.product_name = product_name || product.product_name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock_quantity = stock_quantity || product.stock_quantity;
    product.category_id = category_id || product.category_id;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin sản phẩm:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin sản phẩm.' });
  }
},


  /**
   * @desc Xóa một sản phẩm
   * @route DELETE /api/products/:product_id
   * @access Public
   */
  deleteProduct: async (req, res) => {
    const { product_id } = req.params;
    try {
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
      }
      await product.destroy();
      res.json({ message: 'Xóa sản phẩm thành công.' });
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
  },
   /**
   * @desc Lấy danh sách sản phẩm theo category_id
   * @route GET /api/products/category/:category_id
   * @access Public
   */
   getProductsByCategory: async (req, res) => {
    const { category_id } = req.params;
    try {
      const products = await Product.findAll({
        where: { category_id }
      });

      // Kiểm tra nếu không có sản phẩm nào thuộc danh mục này
      if (!products || products.length === 0) {
        return res.status(404).json({ error: 'Không có sản phẩm nào thuộc danh mục này.' });
      }

      // Lặp qua từng sản phẩm để chuyển đổi ảnh thành base64
      const productsWithBase64Images = await Promise.all(products.map(async (product) => {
        const base64Image = await getImageBase64(product.image_link);
        return {
          ...product.toJSON(),
          image_base64: "data:image/jpeg;base64," + base64Image
        };
      }));

      res.json(productsWithBase64Images);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm theo category_id:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm theo category_id.' });
    }
  },
  /**
 * @desc Tìm kiếm sản phẩm theo tên
 * @route GET /api/products/search/:search_query
 * @access Public
 */
searchProductsByName: async (req, res) => {
  const { search_query } = req.params;
  try {
    const products = await Product.findAll({
      where: {
        product_name: {
          [Op.like]: `%${search_query}%`
        }
      }
    });

    // Kiểm tra nếu không có sản phẩm nào được tìm thấy
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }

    // Lặp qua từng sản phẩm để chuyển đổi ảnh thành base64
    const productsWithBase64Images = await Promise.all(products.map(async (product) => {
      const base64Image = await getImageBase64(product.image_link);
      return {
        ...product.toJSON(),
        image_base64: "data:image/jpeg;base64," + base64Image
      };
    }));

    res.json(productsWithBase64Images);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm theo tên:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi tìm kiếm sản phẩm theo tên.' });
  }
},
/**
 * @desc    Lấy danh sách sản phẩm của tất cả các danh mục
 * @route   GET /api/products/categories
 * @access  Public
 */
getCategoryWithProducts: async (req, res) => {
  try {
    // Lấy tất cả danh mục từ cơ sở dữ liệu
    const categories = await Category.findAll();

    // Kiểm tra nếu không có danh mục nào
    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: 'Không có danh mục nào trong cơ sở dữ liệu.' });
    }

    // Lặp qua từng danh mục để lấy danh sách sản phẩm của mỗi danh mục
    const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
      const categoryId = category.category_id;
      const categoryName = category.category_name;

      // Lấy danh sách sản phẩm của từng danh mục
      const products = await Product.findAll({ where: { category_id: categoryId } });

      // Chỉ thêm danh mục vào danh sách nếu có ít nhất một sản phẩm
      if (products && products.length > 0) {
        // Chuyển đổi ảnh của mỗi sản phẩm thành base64
        const productsWithBase64Images = await Promise.all(products.map(async (product) => {
          const base64Image = await getImageBase64(product.image_link);
          return {
            ...product.toJSON(),
            image_base64: "data:image/jpeg;base64," + base64Image
          };
        }));

        return {
          category_name: categoryName,
          products: productsWithBase64Images
        };
      }
    }));

    // Loại bỏ các danh mục không có sản phẩm
    const validCategories = categoriesWithProducts.filter(category => category);

    // Trả về danh sách các danh mục và sản phẩm của mỗi danh mục
    res.json(validCategories);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm của tất cả các danh mục:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm của tất cả các danh mục.' });
  }
}


};

module.exports = productController;
