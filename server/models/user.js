module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firebase_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: DataTypes.STRING,
  });

  User.associate = () => {
    // associations can be defined here
  };

  return User;
};
