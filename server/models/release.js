module.exports = (sequelize, DataTypes) => {
  const Release = sequelize.define(
    'Release',
    {
      title: DataTypes.STRING,
      cover: DataTypes.STRING,
      magazine: DataTypes.STRING,
    },
    {}
  );

  return Release;
};
