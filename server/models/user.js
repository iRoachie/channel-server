const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: DataTypes.STRING,
    },
    {
      instanceMethods: {
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        },
      },
      hooks: {
        beforeCreate: user => {
          user.password = bcrypt.hashSync(user.password);
        },
        beforeUpdate: user => {
          user.password = bcrypt.hashSync(user.password);
        },
      },
    }
  );

  User.associate = function() {
    // associations can be defined here
  };

  return User;
};
