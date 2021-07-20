'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING(20),
      unique: false,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(20),
      unique: false,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
  });
  return User;
};