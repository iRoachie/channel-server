const Sequelize = require('sequelize');
require('dotenv').load();

const defaults = {
  dialect: 'mysql',
  dialectOptions: {
    decimalNumbers: true,
  },
  operatorsAliases: Sequelize.Op,
};

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'channel-app',
    host: '127.0.0.1',
    port: 13306,
    ...defaults,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    port: 3306,
    ...defaults,
  },
};
