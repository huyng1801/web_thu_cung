const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Category extends Model {}

Category.init({
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  tableName: 'categories',
  timestamps: false
});

module.exports = Category;
