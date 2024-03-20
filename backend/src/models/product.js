const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Category = require('./category'); // Import model của bảng categories

class Product extends Model {}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image_link: {
      type: DataTypes.TEXT
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'category_id'
      }
    }
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false
  }
);
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });
module.exports = Product;
