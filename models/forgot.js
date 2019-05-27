'use strict';
module.exports = (sequelize, DataTypes) => {
  const forgot = sequelize.define('forgot', {
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  });

  forgot.associate = function(models) {
    forgot.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
  };
  return forgot;
};