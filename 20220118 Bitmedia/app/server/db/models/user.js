const { DataTypes } = require('sequelize'),
      sequelize     = require('../sequelize.js'),
      Userstatistic = require('./userstatistic.js');

const User = sequelize.define('user', {
  id: {
    type          : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey    : true,
    allowNull     : false
  },
  first_name: {
    type      : DataTypes.STRING,
    allowNull : false
  },
  last_name: {
    type      : DataTypes.STRING,
    allowNull : false
  },
  email: {
    type      : DataTypes.STRING,
    allowNull : false
  },
  gender: {
    type      : DataTypes.STRING,
    allowNull : false
  },
  ip_address: {
    type      : DataTypes.STRING,
    allowNull : false
  }
});

User.hasMany(Userstatistic, { onDelete: 'cascade', foreignKey: 'user_id'});

module.exports = User;