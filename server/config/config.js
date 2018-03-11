const Sequelize = require('sequelize');

module.exports = {
  development: {
    username: 'root',
    password: 'root',
    database: 'channel_app',
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 8889,
    operatorsAliases: Sequelize.Op
  }
};
