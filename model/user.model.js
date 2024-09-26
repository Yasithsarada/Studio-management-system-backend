module.exports = (sequelize, Sequelize) => {
const User = sequelize.define('User', {
  empId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  otp: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  otpExpire: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});
return User;
}

