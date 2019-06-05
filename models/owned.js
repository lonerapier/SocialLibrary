'use strict';
module.exports = (sequelize, DataTypes) => {
  const owned = sequelize.define('owned', {
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('lend', 'sell'),
        allowNull: false,
    },
    borrowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    URL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  });

  owned.associate = function(models) {
    // associations can be defined here
    owned.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    owned.belongsTo(models.book, {
      foreignKey: 'bookId',
      onDelete: 'CASCADE',
    });
    owned.hasMany(models.request, {
      foreignKey: 'bookId',
    });
  };
  return owned;
};