'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  book.associate = function(models) {
    // associations can be defined here
    book.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return book;
};