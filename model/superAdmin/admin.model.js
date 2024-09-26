module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define('Admin', {
    empId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return Admin;
};

