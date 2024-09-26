

module.exports = (sequelize, Sequelize) => {
    const tasks = sequelize.define("tasks", {
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'id',  
       }
      },
      taskName:{
        type:Sequelize.STRING,
      },
      date : {
        type : Sequelize.DATE
      },
      serviceType: {
        type: Sequelize.ENUM,
        values: ['editing' , 'photography' , 'one day services']
      },
      department: {
        type: Sequelize.ENUM,
        values: ['editing' , 'photography']
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Upcoming','Paused', 'Done' , "Rejected"]
      },
      description: {
        type: Sequelize.STRING
      }
    });
      return tasks
    };