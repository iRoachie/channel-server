const { DEFAULT_AVATAR } = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: DEFAULT_AVATAR,
    },
  });

  User.associate = () => {
    // associations can be defined here
  };

  return User;
};
