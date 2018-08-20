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

  Course.associate = models => {
    Course.hasMany(models.Review, {
      foreignKey: 'courseId',
    });
  };

  return Course;
};
