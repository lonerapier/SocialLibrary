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
      primaryKey: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  book.associate = function(models) {
    // associations can be defined here
    book.hasMany(models.owned, {
      foreignKey: 'bookId',
      as: 'owned by',
    });
    book.belongsTo(models.author, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
    });
    book.belongsTo(models.publisher, {
      foreignKey: 'publisherId',
      onDelete: 'CASCADE',
    });
  };
  return book;
};