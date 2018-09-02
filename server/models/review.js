module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: ['September', 'Summer', 'January'],
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: new Date().getFullYear(),
        },
      },
      comment: DataTypes.TEXT,
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

  Review.associate = models => {
    // associations can be defined here
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
    });

    Review.belongsTo(models.Lecturer, {
      foreignKey: 'lecturerId',
    });

    Review.belongsTo(models.Course, {
      foreignKey: 'courseId',
    });
  };

  return Review;
};
