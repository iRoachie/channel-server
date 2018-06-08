module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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

  User.associate = function() {
    // associations can be defined here
  };

  return User;
};
