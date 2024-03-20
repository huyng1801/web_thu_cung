const Order = require('./order'); // Import model của bảng orders
const Product = require('./product'); // Import model của bảng products
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');
class OrderDetail extends Model {}

OrderDetail.init({
  order_detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order, // Sử dụng biến Order thay vì chuỗi 'Order'
      key: 'order_id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, // Sử dụng biến Product thay vì chuỗi 'Product'
      key: 'product_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sale_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'OrderDetail',
  tableName: 'order_details',
  timestamps: false
});
Product.hasMany(OrderDetail, { foreignKey: 'product_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = OrderDetail;
