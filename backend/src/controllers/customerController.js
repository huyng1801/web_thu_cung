const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig')
const customerController = {
  /**
  * @desc Lấy danh sách khách hàng
  * @route GET /api/customers
  * @access Private
  */
  getCustomers: async (req, res) => {
    try {
      // Lấy danh sách khách hàng từ cơ sở dữ liệu
      const customers = await Customer.findAll();
      res.json({ customers });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khách hàng.' });
    }
  },
  /**
   * @desc Đăng ký một tài khoản khách hàng mới
   * @route POST /api/customers/register
   * @access Public
   */
  register: async (req, res) => {
    const { email, password, full_name, phone_number, address, city } = req.body;

    try {
      // Kiểm tra xem email đã được sử dụng chưa
      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Email đã được sử dụng.' });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo tài khoản khách hàng mới
      const newCustomer = await Customer.create({
        email,
        password: hashedPassword,
        full_name,
        phone_number,
        address,
        city
      });

      res.status(201).json({ message: 'Đăng ký thành công.', customer: newCustomer });
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng ký.' });
    }
  },

  /**
   * @desc Đăng nhập tài khoản khách hàng
   * @route POST /api/customers/login
   * @access Public
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const customer = await Customer.findOne({ where: { email } });
      if (!customer || !(await bcrypt.compare(password, customer.password))) {
        return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
      }

      const token = jwt.sign({ id: customer.customer_id }, jwtConfig.jwtSecret, { expiresIn: '1h' });
   
      res.json({ customer_id: customer.customer_id, full_name: customer.full_name, token });

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập.' });
    }
  },
  /**
  * @desc Sửa thông tin của khách hàng
  * @route PUT /api/customers/:customer_id
  * @access Private
  */
  updateInfo: async (req, res) => {
    const { customer_id } = req.params;
    const { full_name, phone_number, address, city } = req.body;

    try {
      // Kiểm tra xem header có tồn tại không trước khi sử dụng
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized: Token không được cung cấp.' });
      }

      // Xác thực token và lấy thông tin người dùng
      const token = req.headers.authorization;
      const decodedToken = jwt.verify(token, jwtConfig.jwtSecret);
      if (decodedToken.id !== parseInt(customer_id)) {
        return res.status(403).json({ error: 'Không có quyền thực hiện thao tác này.' });
      }

      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng.' });
      }

      // Cập nhật thông tin khách hàng
      customer.full_name = full_name;
      customer.phone_number = phone_number;
      customer.address = address;
      customer.city = city;
      await customer.save();

      res.json({ message: 'Cập nhật thông tin thành công.', customer });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token không hợp lệ.' });
      }
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật thông tin.' });
    }
  },


  /**
   * @desc Đổi mật khẩu của khách hàng
   * @route PUT /api/customers/:customer_id/change-password
   * @access Private
   */
  
  changePassword: async (req, res) => {
    const { customer_id } = req.params;
    const { old_password, new_password } = req.body;

    try {
      // Xác thực token và lấy thông tin người dùng
      const decodedToken = jwt.verify(req.headers.authorization, jwtConfig.jwtSecret);
      if (decodedToken.id !== parseInt(customer_id)) {
        return res.status(403).json({ error: 'Không có quyền thực hiện thao tác này.' });
      }

      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng.' });
      }

      // Kiểm tra mật khẩu cũ
      const isPasswordMatch = await bcrypt.compare(old_password, customer.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Mật khẩu cũ không đúng.' });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      customer.password = hashedNewPassword;
      await customer.save();

      res.json({ message: 'Đổi mật khẩu thành công.' });
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi đổi mật khẩu.' });
    }
  },
  /**
   * @desc Lấy danh sách các đơn hàng của một khách hàng
   * @route GET /api/customers/:customer_id/orders
   * @access Public
   */
  getOrdersByCustomer: async (req, res) => {
    const { customer_id } = req.params;
    try {
      // Kiểm tra xem customer_id có hợp lệ không
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: 'Không tìm thấy khách hàng.' });
      }

      // Lấy danh sách các đơn hàng của khách hàng
      const orders = await Order.findAll({ where: { customer_id } });
      res.json(orders);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng của khách hàng:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng của khách hàng.' });
    }
  }
};

module.exports = customerController;
