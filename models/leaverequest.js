'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    static associate(models) {
      LeaveRequest.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  LeaveRequest.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('sick', 'annual', 'personal'),
        allowNull: false
      },
      reason: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      attachment: { 
        type: DataTypes.STRING, 
        allowNull: true 
      },
    },
    {
      sequelize,
      modelName: 'LeaveRequest',
      tableName: 'LeaveRequests',
      timestamps: true
    }
  );

  return LeaveRequest;
};
