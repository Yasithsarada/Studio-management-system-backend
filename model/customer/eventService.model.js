module.exports = (sequelize, Sequelize) => {
    const eventServices = sequelize.define("eventServices", {
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: "events",
          key: "id", 
        },
      },
      serviceInputFieldId: {
        type: Sequelize.INTEGER,
        references: {
          model: "serviceInputFields",
          key: "id", 
        },
      },
      value: {
        type: Sequelize.STRING,
      }
    });
    return eventServices;
  };
  