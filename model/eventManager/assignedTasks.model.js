
module.exports = (sequelize, Sequelize) => {
  
    const assignedTasks = sequelize.define("assignedTasks", {
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'id',  
       }
      },
      emplyId: {
        type: Sequelize.INTEGER,
        // primaryKey: true,
        // autoIncrement: true,
         //   type: Sequelize.INTEGER,
        references: {
          model: 'employees',
          key: 'id',  
       }
      },
      taskId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id',  
       }
      },
    });
      return assignedTasks;
    };