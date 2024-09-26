module.exports = (sequelize, Sequelize) => {
  const Privileges = sequelize.define('Privileges', {
    empId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'employees',
        key: 'id',
      },
    },
    privilege: {
      type: Sequelize.ENUM,
      values: [
        'super_admin',
        'customer_manager',
        'event_manager',
        'employee_manager',
        'stock_manager',
      ],
    },
  });
  return Privileges;
};
