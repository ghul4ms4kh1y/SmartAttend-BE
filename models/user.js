'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Department, { foreignKey: 'department_id' });
      User.hasMany(models.Attendance, { foreignKey: 'user_id' });
      User.hasMany(models.LeaveRequest, { foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'employee'),
        defaultValue: 'employee'
      },
      photo: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true
    }
  );

  return User;
};
