const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const bcrypt = require('bcrypt');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }

}, {
  timestamps: false
});


module.exports = User;
