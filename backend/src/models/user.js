const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/dbConfig'); 

class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(320),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'users',
  timestamps: false
});

module.exports = User;
