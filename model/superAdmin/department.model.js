module.exports = (sequelize, Sequelize) => {
  const Departments = sequelize.define("departments", {
    departmentName: {
      type: Sequelize.STRING,
    },
    departmentHeadId: {
      type: Sequelize.INTEGER,
      
    },
    departmentHeadName: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    }
  });
  return Departments;
};