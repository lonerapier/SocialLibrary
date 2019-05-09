'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
          isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive'
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.book, {
      foreignKey: 'userId',
      as: 'books',
    });
  };
  return user;
};