module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define(`School`, {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  });

  School.associate = models => {
    School.hasMany(models.Lecturer, {
      foreignKey: `schoolId`,
    });
  };

  return School;
};
