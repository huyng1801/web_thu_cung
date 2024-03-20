const Order = require('../models/order');
const Customer = require('../models/customer');
const OrderDetail = require('../models/orderDetail'); 
const Product = require('../models/product');
const sequelize = require('../config/dbConfig');

const orderController = {

/**
 * @desc Lấy danh sách tất cả các đơn hàng với tổng giá trị dựa trên chi tiết đơn hàng và tên khách hàng
 * @route GET /api/orders
 * @access Public
 */
getAllOrders: async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        'order_id',
        'order_date',
        'note',
        'status',
        [sequelize.literal('(SELECT SUM(quantity * sale_price) FROM order_details WHERE order_details.order_id = Order.order_id)'), 'total_price']
      ],
      include: [{
        model: Customer,
        attributes: ['full_name', 'email', 'phone_number', 'address', 'city'] // Lấy chỉ tên khách hàng
      }]
    });
    res.json(orders);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng.' });
  }
},

 /**
   * @desc Lấy thông tin của một đơn hàng theo ID
   * @route GET /api/orders/:order_id
   * @access Public
   */
  getOrderById: async (req, res) => {
    const { order_id } = req.params;
    try {
      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
      }
      res.json(order);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
    }
  },
  /**
   * @desc Thêm một đơn hàng mới kèm theo chi tiết đơn hàng
   * @route POST /api/orders
   * @access Public
   */
  addOrderWithDetails: async (req, res) => {
    const { note, status, customer_id, order_details } = req.body;
    try {
      // Kiểm tra xem customer_id có hợp lệ không
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(400).json({ error: 'Khách hàng không hợp lệ.' });
      }

      // Tạo đơn hàng mới
      const newOrder = await Order.create({ note, status, customer_id });

      // Lấy order_id của đơn hàng mới tạo
      const orderId = newOrder.order_id;

      // Thêm chi tiết đơn hàng
  // Thêm chi tiết đơn hàng
for (const detail of order_details) {
  const { product_id, quantity } = detail;
  try {
    // Tìm sản phẩm để lấy giá bán
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(400).json({ error: 'Sản phẩm không hợp lệ.' });
    }

    // Lấy giá bán của sản phẩm
    const sale_price = product.price;
    console.log(sale_price);
    // Tạo bản ghi mới trong OrderDetail
    await OrderDetail.create({ order_id: orderId, product_id, quantity, sale_price });
  } catch (error) {
    console.error('Lỗi khi tạo chi tiết đơn hàng:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi tạo chi tiết đơn hàng.' });
  }
}


      res.status(201).json({ message: 'Thêm đơn hàng thành công.' });
    } catch (error) {
      console.error('Lỗi khi thêm đơn hàng mới:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm đơn hàng mới.' });
    }
  },
  /**
   * @desc Cập nhật thông tin của một đơn hàng
   * @route PUT /api/orders/:order_id
   * @access Public
   */
  updateOrder: async (req, res) => {
    const { order_id } = req.params;
    const { note, status, customer_id } = req.body;
    try {
      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
      }

      // Kiểm tra xem customer_id có hợp lệ không
      if (customer_id) {
        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
          return res.status(400).json({ error: 'Khách hàng không hợp lệ.' });
        }
      }

      order.note = note || order.note;
      order.status = status || order.status;
      order.customer_id = customer_id || order.customer_id;

      await order.save();
      res.json(order);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin đơn hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin đơn hàng.' });
    }
  },

  /**
   * @desc Xóa một đơn hàng
   * @route DELETE /api/orders/:order_id
   * @access Public
   */
  deleteOrder: async (req, res) => {
    const { order_id } = req.params;
    try {
      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
      }
      await order.destroy();
      res.json({ message: 'Xóa đơn hàng thành công.' });
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa đơn hàng.' });
    }
  },
/**
 * @desc Thống kê doanh thu cho tháng hiện tại
 * @route GET /api/orders/revenue/current-month
 * @access Public
 */
getRevenueCurrentMonth: async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Lấy tháng hiện tại
    const currentYear = currentDate.getFullYear(); // Lấy năm hiện tại

    const queryString = `
      SELECT MONTH(orders.order_date) AS month, SUM(quantity * sale_price) AS total_revenue
      FROM order_details
      JOIN orders ON order_details.order_id = orders.order_id
      WHERE orders.status = 'Hoàn tất'
      AND YEAR(orders.order_date) = ${currentYear}
      AND MONTH(orders.order_date) = ${currentMonth}
      GROUP BY MONTH(orders.order_date);
    `;
    const [result, metadata] = await sequelize.query(queryString);

    res.json(result[0] || { month: currentMonth, total_revenue: 0 });
  } catch (error) {
    console.error('Lỗi khi thống kê doanh thu cho tháng hiện tại:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thống kê doanh thu cho tháng hiện tại.' });
  }
},

/**
 * @desc Thống kê doanh thu cho các tháng trong năm
 * @route GET /api/orders/revenue/yearly
 * @access Public
 */
getRevenueYearly: async (req, res) => {
  try {
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

    const queryString = `
      SELECT MONTH(orders.order_date) AS month, SUM(quantity * sale_price) AS total_revenue
      FROM order_details
      JOIN orders ON order_details.order_id = orders.order_id
      WHERE orders.status = 'Hoàn tất'
      AND YEAR(orders.order_date) = ${currentYear}
      GROUP BY MONTH(orders.order_date);
    `;
    const [result, metadata] = await sequelize.query(queryString);

    const currentMonth = new Date().getMonth() + 1;
    const filteredResult = result.filter(item => item.month <= currentMonth);

    res.json(filteredResult);
  } catch (error) {
    console.error('Lỗi khi thống kê doanh thu cho các tháng trong năm:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thống kê doanh thu cho các tháng trong năm.' });
  }
},

/**
 * @desc Thống kê doanh thu trong mỗi ngày
 * @route GET /api/orders/revenue/daily
 * @access Public
 */
getDailyRevenue: async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD

    const queryString = `
      SELECT DATE(orders.order_date) AS date, SUM(quantity * sale_price) AS total_revenue
      FROM order_details
      JOIN orders ON order_details.order_id = orders.order_id
      WHERE orders.status = 'Hoàn tất'
      AND DATE(orders.order_date) <= '${currentDateString}'
      GROUP BY DATE(orders.order_date);
    `;
    const [result, metadata] = await sequelize.query(queryString);

    res.json(result[0] || { date: currentDate, total_revenue: 0 });
  } catch (error) {
    console.error('Lỗi khi thống kê doanh thu trong mỗi ngày:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi thống kê doanh thu trong mỗi ngày.' });
  }
}



};

module.exports = orderController;
