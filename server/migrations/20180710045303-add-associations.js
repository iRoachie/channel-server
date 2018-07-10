module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [
      queryInterface.addColumn('Lecturers', 'schoolId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Schools',
          key: 'id',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
      queryInterface.addColumn('Reviews', 'userId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('Reviews', 'lecturerId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Lecturers',
          key: 'id',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('Reviews', 'courseId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses',
          key: 'id',
          allowNull: false,
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ];
    // @ts-ignore
    return Promise.all(promises);
  },

  down: queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    const promises = [
      queryInterface.removeColumn('Lecturers', 'schoolId'),
      queryInterface.removeColumn('Reviews', 'userId'),
      queryInterface.removeColumn('Reviews', 'lecturerId'),
      queryInterface.removeColumn('Reviews', 'courseId'),
    ];

    // @ts-ignore
    return Promise.all(promises);
  },
};
