const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const services = sequelize.define("services", {
      serviceName: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      parentService: {
        type: Sequelize.INTEGER,
        references: {
          model: "services",
          key: 'id',
        },
        onDelete: 'CASCADE' // Add this line to enable cascade delete
      },
      price: {
        type: Sequelize.REAL,
      }
      
    });
      return services
    };