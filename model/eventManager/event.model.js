module.exports = (sequelize, Sequelize) => {
  const events = sequelize.define("events", {
    customerId: {
      type: Sequelize.INTEGER,
      references: {
          model: "customers",
          key: 'id', // Specify ON UPDATE NO ACTION
        } 
    },
    serviceId: {
      type: Sequelize.INTEGER,
      references: {
        model: "services",
        key: "id", 
      },
    },
    serviceDate: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
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
    //
    status: {
      type: Sequelize.ENUM,
      values: ['Pending', 'Upcoming', 'Done' , 'Paused' ,'Rejected'],
    },
  });
  return events;
};
