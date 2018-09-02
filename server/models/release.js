module.exports = (sequelize, DataTypes) => {
  const Release = sequelize.define('Release', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    magazine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Release;
};
