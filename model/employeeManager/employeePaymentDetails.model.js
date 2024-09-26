module.exports = (sequelize, Sequelize) => {
    const employeePaymentDetails = sequelize.define("employeePaymentDetails", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      bank: {
        type: Sequelize.STRING
      },
      epfNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      accountNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      empSalary: {
      type: Sequelize.INTEGER
    },
      overtimeRate: {
        type: Sequelize.INTEGER
      },
      salary: {
        type: Sequelize.INTEGER
      }
    });
    return employeePaymentDetails;
  };
  