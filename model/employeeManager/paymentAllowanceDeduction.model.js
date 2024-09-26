module.exports = (sequelize, Sequelize) => {
    const paymentAllowanceDeduction = sequelize.define("paymentAllowanceDeduction", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      allowanceDeduction: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      allowanceDeductionName: {
        type: Sequelize.STRING,
        primaryKey: true,
      }
    });
    return paymentAllowanceDeduction;
  };
  