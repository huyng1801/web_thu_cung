const OrderDetail = require('../models/orderDetail');
const Order = require('../models/order');
const Product = require('../models/product');
const { getImageBase64 } = require('../middleware/getImageBase64');
const orderDetailController = {

 /**
 * @desc Lấy chi tiết của một đơn hàng dựa trên order_id
 * @route GET /api/order-details/:order_id
 * @access Public
 */
getOrderDetailsByOrderId: async (req, res) => {
  const { order_id } = req.params;
  try {
    const orderDetails = await OrderDetail.findAll({ 
      where: { order_id },
      include: [{ model: Product }] // Thực hiện join với bảng Product
    });

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chi tiết đơn hàng cho order_id đã cho.' });
    }

    // Lặp qua từng chi tiết đơn hàng để thêm base64 của hình ảnh
    const orderDetailsWithBase64Images = await Promise.all(orderDetails.map(async (detail) => {
      const product = detail.Product;
      const base64Image = await getImageBase64(product.image_link);
      return {
        ...detail.toJSON(),
        Product: {
          ...product.toJSON(),
          image_base64: "data:image/jpeg;base64," + base64Image
        }
      };
    }));

    res.json(orderDetailsWithBase64Images);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng.' });
  }
}

  ,
  

/**
 * @desc Cập nhật thông tin của một chi tiết đơn hàng
 * @route PUT /api/order-details/:order_detail_id
 * @access Public
 */
  updateOrderDetail: async (req, res) => {
    const { order_detail_id } = req.params;
    const { order_id, product_id, quantity, sale_price } = req.body;
    try {
      const orderDetail = await OrderDetail.findByPk(order_detail_id);
      if (!orderDetail) {
        return res.status(404).json({ error: 'Không tìm thấy chi tiết đơn hàng.' });
      }

      // Kiểm tra xem order_id và product_id có hợp lệ không
      if (order_id) {
        const order = await Order.findByPk(order_id);
        if (!order) {
          return res.status(400).json({ error: 'Đơn hàng không hợp lệ.' });
        }
      }
      if (product_id) {
        const product = await Product.findByPk(product_id);
        if (!product) {
          return res.status(400).json({ error: 'Sản phẩm không hợp lệ.' });
        }
      }

      orderDetail.order_id = order_id || orderDetail.order_id;
      orderDetail.product_id = product_id || orderDetail.product_id;
      orderDetail.quantity = quantity || orderDetail.quantity;
      orderDetail.sale_price = sale_price || orderDetail.sale_price;

      await orderDetail.save();
      res.json(orderDetail);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin chi tiết đơn hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin chi tiết đơn hàng.' });
    }
  },

  /**
   * @desc Xóa một chi tiết đơn hàng
   * @route DELETE /api/order-details/:order_detail_id
   * @access Public
   */
  deleteOrderDetail: async (req, res) => {
    const { order_detail_id } = req.params;
    try {
      const orderDetail = await OrderDetail.findByPk(order_detail_id);
      if (!orderDetail) {
        return res.status(404).json({ error: 'Không tìm thấy chi tiết đơn hàng.' });
      }
      await orderDetail.destroy();
      res.json({ message: 'Xóa chi tiết đơn hàng thành công.' });
    } catch (error) {
      console.error('Lỗi khi xóa chi tiết đơn hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa chi tiết đơn hàng.' });
    }
  }
};

module.exports = orderDetailController;
