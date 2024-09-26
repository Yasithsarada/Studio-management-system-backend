module.exports = (sequelize, Sequelize) => {
    const payslips = sequelize.define("payslips", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      month: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      otAmount: {
        type: Sequelize.INTEGER,
      },
      grossEarnings: {
        type: Sequelize.INTEGER,
      },
      grossDeductions: {
        type: Sequelize.INTEGER,
      },
      totalNetPay: {
        type: Sequelize.INTEGER,
      }
    });
    return payslips;
  };
  