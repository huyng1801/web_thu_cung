const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Customer extends Model {}

Customer.init(
  {
    // Định nghĩa các trường cho model Customer
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(50),
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    modelName: 'Customer',
    timestamps: false,
  }
);


module.exports = Customer;
