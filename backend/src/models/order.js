const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Customer = require('./customer'); // Import model của bảng customers
const OrderDetail = require('./orderDetail'); // Import model của bảng orderDetails

class Order extends Model {}

Order.init(
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    note: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.STRING(50)
    },
    customer_id: {
      type: DataTypes.INTEGER, // Change data type to INTEGER for consistency with primary key of Customer model
      references: {
        model: Customer,
        key: 'customer_id'
      }
    }
  },
  {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
    timestamps: false
  }
);

// Thiết lập mối quan hệ với OrderDetail
Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = Order;
