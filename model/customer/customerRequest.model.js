module.exports = (sequelize, Sequelize) => {
    const customerRequests = sequelize.define("customerRequests", {
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,

      },
      mobilePhone: {
        type: Sequelize.STRING,
   
      },
      address: {
        type: Sequelize.STRING
      },
      serviceType: {
        type: Sequelize.STRING,
      },
      serviceDate: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'confirmed']
      }

    });
      return customerRequests
    };