const Sequelize = require('sequelize');
require('dotenv').load();

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'channel_app',
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    port: 8889,
    operatorsAliases: Sequelize.Op,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    port: 3306,
    operatorsAliases: Sequelize.Op,
  },
};
