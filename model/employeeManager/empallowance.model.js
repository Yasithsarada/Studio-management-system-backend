module.exports = (sequelize, Sequelize) => {
    const empallowance = sequelize.define("empallowance", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      allowanceid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      empId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'employees', // name of the target table
            key: 'id', // key in the target table that we're referencing
        },
      },
      Amount: {
        type: Sequelize.INTEGER,
      },
      date: Sequelize.STRING,
    });
    return empallowance;
  };
  