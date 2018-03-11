"use strict";

module.exports = (sequelize, DataTypes) => {
  var School = sequelize.define(
    "School",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );

  School.associate = function(models) {
    // associations can be defined here
    School.hasMany(models.Lecturer, {
      foreignKey: "schoolId",
    });
  };

  return School;
};
