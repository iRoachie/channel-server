'use strict';

const { DEFAULT_AVATAR } = require(`../config/constants`);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(`Users`, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: DEFAULT_AVATAR,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable(`Users`);
  },
};
