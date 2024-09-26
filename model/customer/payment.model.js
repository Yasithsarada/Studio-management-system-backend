const customerModel = require("./customer.model");

module.exports = (sequelize, Sequelize) => {
    const customerPayments = sequelize.define("customerPayments", {
        // customerId: {
        //   type: Sequelize.INTEGER,
        //   references: {
        //       model: "customers", 
        //       key: 'id',
        //       onDelete: 'NO ACTION', // Specify ON DELETE NO ACTION
        //       onUpdate: 'NO ACTION' // Specify ON UPDATE NO ACTION
        //     } 
        // },
        eventId: {
          type: Sequelize.INTEGER,
          references: {
              model: "events",
              key: 'id', // Specify ON UPDATE NO ACTION
            } 
        },
        // eventId:{
        //   type:Sequelize.STRING
        // },
        // eventId: {
        //   type: Sequelize.INTEGER,
        //   // references: {
        //   //     model: "customers", 
        //   //     key: 'id'
        //   //   } 
        // },
        customerMobilePhone: {
          type: Sequelize.STRING
        },
        customerName: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.STRING
        },
        amount: {
          type: Sequelize.REAL,
        },
        offers: {
          type: Sequelize.REAL,
        },
        payment: {
          type: Sequelize.REAL,
        },
        status: {
          type: Sequelize.STRING
        },
        type: {
          type: Sequelize.STRING
        }
      });

    return customerPayments;
  };