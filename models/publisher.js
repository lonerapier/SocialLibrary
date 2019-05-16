'use strict';
module.exports = (sequelize, DataTypes) => {
  const publisher = sequelize.define('publisher', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  });

  publisher.associate = function(models) {
    // associations can be defined here
    publisher.hasMany(models.book, {
      foreignKey: 'publisherId',
      as: 'published by',
    });
  };
  return publisher;
};