'use strict';

const fs = require('fs');
const path = require('path');
import * as Sequelize from 'sequelize';
import * as functions from 'firebase-functions';
const basename = path.basename(__filename);
const db = {};

const connectionString =
  process.env.NODE_ENV === 'production'
    ? functions.config().mysql.string
    : 'mysql://root:root@127.0.0.1:13306/channel-app';

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  dialectOptions: {
    decimalNumbers: true,
  },
  operatorsAliases: false,
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

module.exports = db;
