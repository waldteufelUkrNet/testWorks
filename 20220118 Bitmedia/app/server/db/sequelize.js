const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './app/server/db/dbase.sqlite',
  logging: false,
  define  : {
    timestamps: false
  }
});

module.exports = sequelize;