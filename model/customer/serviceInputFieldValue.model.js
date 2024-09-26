const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const serviceInputFieldValues = sequelize.define("serviceInputFieldValues", {
      fieldValueName: {
        type: Sequelize.STRING,
      },
      serviceInputFieldId: {
        type: Sequelize.INTEGER,
        references: {
            model: "serviceInputFields",
            key: 'id', 
          } 
      },
      price: {
        type: Sequelize.REAL,
      }
      
    });
      return serviceInputFieldValues
    };