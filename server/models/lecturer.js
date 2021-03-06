module.exports = (sequelize, DataTypes) => {
  const Lecturer = sequelize.define(
    `Lecturer`,
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: DataTypes.STRING,
    },
    {}
  );

  Lecturer.associate = models => {
    // associations can be defined here
    Lecturer.belongsTo(models.School, {
      foreignKey: `schoolId`,
    });

    Lecturer.hasMany(models.Review, {
      foreignKey: `lecturerId`,
      as: `reviews`,
    });
  };

  return Lecturer;
};
