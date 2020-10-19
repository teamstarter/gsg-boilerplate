const { DataTypes } = require('sequelize')

function Task(sequelize) {
  var Task = sequelize.define(
    'task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'task',
      paranoid: true,
      timestamps: true,
    }
  )

  return Task
}

module.exports = Task
