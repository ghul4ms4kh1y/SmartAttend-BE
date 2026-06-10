'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Attendance.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      check_in: DataTypes.TIME,
      check_out: DataTypes.TIME,
      status: {
        type: DataTypes.ENUM('present', 'late', 'absent', 'leave'),
        defaultValue: 'present'
      },
      notes: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Attendance',
      tableName: 'Attendances',
      timestamps: true
    }
  );

  return Attendance;
};
