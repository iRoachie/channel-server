module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );

  Course.associate = function() {
    // associations can be defined here
  };

  return Course;
};
