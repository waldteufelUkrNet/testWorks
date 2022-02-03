const { DataTypes }    = require('sequelize'),
        chalk          = require('chalk'),
        fs             = require('fs'),
        sequelize      = require('../db/sequelize.js'),
        queryInterface = sequelize.getQueryInterface();

module.exports = async function() {
  try {
    await sequelize.authenticate();
    console.log( chalk.black.bgGreen('db connection is ok') );

    const tablesArr = await queryInterface.showAllSchemas();


    let usersTable = tablesArr.find(item => item.name == 'users');
    if (!usersTable) {
      queryInterface.createTable('users', {
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
      const User = require('../db/models/user.js');
      let file = fs.readFileSync(process.env.PATH_TO_SERVER + 'db/startdata/user.json', { encoding: 'utf-8' });
      let users = JSON.parse(file);
      await User.bulkCreate(users);
      console.log( chalk.black.bgGreen('users table was successfully created') );
    }

    let usersStatisticTable = tablesArr.find(item => item.name == 'userstatistics');
    if (!usersStatisticTable) {
      queryInterface.createTable('userstatistics', {
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
      const Userstatistic = require('../db/models/userstatistic.js');
      let file = fs.readFileSync(process.env.PATH_TO_SERVER + 'db/startdata/users_statistic.json', {
        encoding: 'utf-8'
      });
      let userstatistic = JSON.parse(file);
      await Userstatistic.bulkCreate(userstatistic);
      console.log( chalk.black.bgGreen('table with users statistic was successfully created') );
    }

  } catch (error) {
    console.log( chalk.black.bgGreen('db error: '), error );
  }
};