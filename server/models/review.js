"use strict";

module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define(
    "Review",
    {
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: new Date().getFullYear(),
        },
      },
      comment: DataTypes.STRING,
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validations: {
          isNumeric: true,
          min: 1,
          max: 5,
        },
      },
    },
    {}
  );

  Review.associate = function(models) {
    // associations can be defined here
    Review.belongsTo(models.User, {
      foreignKey: "userId",
    });

    Review.belongsTo(models.Lecturer, {
      foreignKey: "lecturerId",
    });

    Review.belongsTo(models.Course, {
      foreignKey: "courseId",
    });
  };

  return Review;
};
