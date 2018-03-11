module.exports = (sequelize, DataTypes) => {
  var Lecturer = sequelize.define(
    "Lecturer",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: DataTypes.STRING,
    },
    {}
  );

  Lecturer.associate = function(models) {
    // associations can be defined here
    Lecturer.belongsTo(models.School, {
      foreignKey: "schoolId",
    });
  };

  return Lecturer;
};
