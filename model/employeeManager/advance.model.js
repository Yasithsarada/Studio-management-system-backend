module.exports = (sequelize, Sequelize) => {
  const Advances = sequelize.define("advances", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true // Ensure this field is unique
    },
    empId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true, // Part of composite primary key
    },
    advanceAmount: {
      type: Sequelize.INTEGER,
    },
    monthtaken: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true, // Part of composite primary key
    },
    advancerequest: {
      type: Sequelize.BOOLEAN, // 1 - is a request, 0 - not a request.
    },
    description: {
      type: Sequelize.STRING,
    },
    reject: {
      type: Sequelize.BOOLEAN, // 1 - is reject , 0 - not rejected.
    },
  }, {
    id: false // Disable the default id primary key
  });

  return Advances;
};
