"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(
      "Schools",
      [
        {
          name: "School of Education and Humanities",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "School of Theology and Religion",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "School of Business",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Science, Technology & Allied Health",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "School of Social Sciences",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Schools", null, {});
  },
};
