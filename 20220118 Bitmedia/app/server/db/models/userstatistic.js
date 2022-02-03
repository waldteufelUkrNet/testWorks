const { DataTypes } = require('sequelize'),
      sequelize     = require('../sequelize.js'),
      User          = require('./user.js');

const Userstatistic = sequelize.define('userstatistic', {
  id: {
    type          : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey    : true,
    allowNull     : false
  },
  user_id: {
    type      : DataTypes.INTEGER,
    allowNull : false
  },
  date: {
    type      : DataTypes.DATEONLY,
    allowNull : false
  },
  clicks: {
    type      : DataTypes.INTEGER,
    defaultValue: 0
  },
  page_views: {
    type      : DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Userstatistic;