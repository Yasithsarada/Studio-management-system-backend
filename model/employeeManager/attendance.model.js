module.exports = (sequelize, Sequelize) => {
    const attendance = sequelize.define("attendance", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        // autoIncrement: true,
      },
      // date: {
      //   type: Sequelize.DATE,
        // primaryKey: true,
      // },
      date: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      checkInSeconds: {
        type: Sequelize.INTEGER
      },
      checkOutSeconds: {
        type: Sequelize.INTEGER
      },
      checkIn: {
        type: Sequelize.TIME
      },
      checkOut: {
        type: Sequelize.TIME
      },
      ot: {
        type: Sequelize.INTEGER
      },
      // dayType: {
      //   type: Sequelize.STRING
      // },
      // leaveType: {
      //   type: Sequelize.STRING
      // }
    });
    return attendance;
  };
  