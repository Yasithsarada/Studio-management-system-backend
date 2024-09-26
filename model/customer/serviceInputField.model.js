const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const serviceInputFields = sequelize.define("serviceInputFields", {
      fieldName: {
        type: Sequelize.STRING,
      },
      serviceId: {
        type: Sequelize.INTEGER,
        references: {
            model: "services",
            key: 'id', 
          } 
      },
      type: {
        type: Sequelize.ENUM,
        values: ['input', 'select',]
      }
      
    });
      return serviceInputFields
    };