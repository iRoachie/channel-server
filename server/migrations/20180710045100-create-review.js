'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(`Reviews`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [`September`, `Summer`, `January`],
        },
      },
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          max: new Date().getFullYear(),
        },
      },
      comment: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validations: {
          isNumeric: true,
          min: 1,
          max: 5,
        },
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
    return queryInterface.dropTable(`Reviews`);
  },
};
