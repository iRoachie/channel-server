'use strict';
module.exports = (sequelize, DataTypes) => {
  var Course = sequelize.define(
    'Course',
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Course.associate = function(models) {
    // associations can be defined here
  };
  return Course;
};