const asyncHandler = require("express-async-handler");
// const Task = require("../../../model/eventManager/task.model");
const db = require("../../../config/db.config");
const { rows } = require("mssql");
const Task = db.tasks;
const AssignedTask = db.assignedTasks;
const Employee = db.employees;
const { Op, Sequelize } = require("sequelize");

// const createTask = asyncHandler(async (req, res) => {
//     try {
//         const {
//           eventId,
//           taskName,
//           serviceType,
//           department,
//           status,
//           description,
//         } = req.body;
//         let { date} = req.body;

//     var selectedDateWithOnedayOff = new Date(date);
//     const correctedDate =  new Date( selectedDateWithOnedayOff.getTime() + Math.abs(selectedDateWithOnedayOff.getTimezoneOffset()*60000) );

//     console.log("eeeeeeeeeeeeeventId: " + eventId);
//         const task = await Task.create({
//             eventId : eventId,
//             taskName : taskName,
//             serviceType : serviceType,
//             department : department,
//             status : status,
//             description : description,
//             date : correctedDate
//         })
//         console.log("eeeeeeeeeeeeeventId: " + eventId);
//     if(!task) return res.status(400).json({ message: "Task creation was not successful!" });
//         res.status(200).json({ message: "Task created successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Could not create the Task!" , error: error.message  });
//     }
// });
const createTask = asyncHandler(async (req, res) => {
  try {
    const {
      eventId,
      taskName,
      serviceType,
      department,
      status,
      description,
      employeeIdList, // Assuming you have a list of employees to assign
      //   taskId,
    } = req.body;
    let { date } = req.body;
    console.log("eventId: " ,eventId)
    console.log("employeeIdList: " ,employeeIdList)
    // Correct the date for timezone offset
    const selectedDateWithOnedayOff = new Date(date);
    const correctedDate = new Date(
      selectedDateWithOnedayOff.getTime() +
        Math.abs(selectedDateWithOnedayOff.getTimezoneOffset() * 60000)
    );

    // Start a transaction
    await db.sequelize.transaction(async (transaction) => {
      // Create the task
      const task = await Task.create(
        {
          eventId,
          taskName,
          serviceType,
          department,
          status,
          description,
          date: correctedDate,
        },
        { transaction }
      );

      if (!task) {
        throw new Error("Task creation was not successful!");
      }

      // Perform additional operations (e.g., assign employees)
      if (employeeIdList && employeeIdList.length > 0) {
        for (const emplyeeId of employeeIdList) {
          const assignedTask = await AssignedTask.create(
            {
              eventId,
              emplyId: emplyeeId,
              taskId: task.id, // Use the ID of the created task
            },
            { transaction }
          );

          if (!assignedTask) {
            throw new Error("Assigning task to employee was not successful!");
          }
        }
      }

      // Optionally, perform more operations within this transaction block
      // ...

      // If all operations succeed, the transaction will be committed automatically
    });

    res.status(200).json({ message: "Task created successfully!" });
  } catch (error) {
    console.error("Error in createTask:", error);
    res
      .status(500)
      .json({ message: "Could not create the Task!", error: error.message });
  }
});

const getEventCategories = asyncHandler(async (req, res) => {
  //get service types of events
  try {
    const serviceTypeValues = await db.sequelize.models.events.rawAttributes
      .serviceType.values;
    if (!serviceTypeValues)
      return res
        .status(400)
        .json({ message: "Event category fetch was not successful!" });
    res.status(200).json({
      serviceTypes: serviceTypeValues,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Event category fetch was not successful!!",
        error: error.message,
      });
  }
});

const getTasksByEmployeeId = asyncHandler(async (req, res) => {
  try {
    console.log("cameeeeeee--------------------------------------------");
    const { emplyId } = req.query;
    // const emplyId = empId;
    console.log("emplyId :" + emplyId);
    // const data = await Event.findOne({ where: { eventId: eventId } ,include :[Customer]  })

    const { count, rows } = await AssignedTask.findAndCountAll({
      where: {
        emplyId,
      },
      include: [{ model: Employee }, { model: Task }],
      // offset: 10,
      // limit: 10,
    });
    const assignedTasks = rows;
    console.log("assignedTasks" + assignedTasks);
    if (!assignedTasks || assignedTasks.length == 0) return res.json({assignedTasks : []});
    else return res.status(200).json({ assignedTasks: assignedTasks });
  } catch (error) {
    console.log("error: ", error);
    res
      .status(500)
      .json({
        message: "Event category fetch was not successful!!",
        error: error.message,
      });
  }
});


const getEmployeesByTaskId = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    // const taskId = empId;
    console.log("taskId :" + taskId);
    // const data = await Event.findOne({ where: { eventId: eventId } ,include :[Customer]  })

    const { count, rows } = await AssignedTask.findAndCountAll({
      where: {
        taskId,
      },
      include: [{ model: Employee }],
      // offset: 10,
      // limit: 10,
    });
    const assignedTasks = rows;
    console.log("assignedTasks" + assignedTasks);
    if (assignedTasks.length == 0) return res.json({assignedTasks : []});
    if (!assignedTasks)  return res.json("No Employees assigned !");

    else return res.status(200).json({ assignedTasks: assignedTasks });

  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Could not get the Tasks!!", error: error.message });
  }
});

const getAllTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 8;
  console.log("get Customer",page,limit);
  let offset = limit * (page - 1)
  try {
    let tasks = await Task.findAll({
      limit: limit,
      offset: offset,
    });
    if (!tasks) return res.status(400).json({ error: "No tasks found" });
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    console.log(error);
  }
});
// app.get('/api/event-enums', (req, res) => {
//     const serviceTypeValues = db.sequelize.models.events.rawAttributes.serviceType.values;

//     res.json({
//       serviceTypes: serviceTypeValues,
//     });
//   });

const getTaskById = asyncHandler(async (req, res) => {
  console.log("task get by id" , );
  const { taskId } = req.query; // Get the task ID from the request parameters
  // console.log("task get by id" , taskId);

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(200).json({ task: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.query;
    const {
      eventId,
      taskName,
      serviceType,
      department,
      status,
      description,
      employeeIdList, // Assuming you have a list of employees to assign
    } = req.body;
    let { date } = req.body;
console.log("Task id ***************************************************:" , taskId);
console.log(req.body);
    // Start a transaction
    await db.sequelize.transaction(async (transaction) => {
      // Find the existing task
      const task = await Task.findByPk(taskId, { transaction });

      if (!task) {
        throw new Error("Task not found!");
      }

      // Prepare the fields to update
      const updatedFields = {};
      if (eventId !== undefined) updatedFields.eventId = eventId;
      if (taskName !== undefined) updatedFields.taskName = taskName;
      if (serviceType !== undefined) updatedFields.serviceType = serviceType;
      if (department !== undefined) updatedFields.department = department;
      if (status !== undefined) updatedFields.status = status;
      if (description !== undefined) updatedFields.description = description;
      if (date !== undefined) {
        const selectedDateWithOnedayOff = new Date(date);
        const correctedDate = new Date(
          selectedDateWithOnedayOff.getTime() +
            Math.abs(selectedDateWithOnedayOff.getTimezoneOffset() * 60000)
        );
        updatedFields.date = correctedDate;
      }
      console.log("employeeIdList :" , employeeIdList)
      // Update the task
      await task.update(updatedFields, { transaction });

      // Perform additional operations (e.g., update assigned employees)
      if (employeeIdList && Array.isArray(employeeIdList)) {
        // Get the existing assigned employees
        const existingAssignments = await AssignedTask.findAll({
          where: { taskId: task.id },
          attributes: ['emplyId'],
          transaction,
        });
        const existingEmployeeIds = existingAssignments.map(a => a.emplyId);

        // Determine which employees need to be added or removed
        const employeesToAdd = employeeIdList.filter(
          id => id !== null && !existingEmployeeIds.includes(id)
        );
        const employeesToRemove = existingEmployeeIds.filter(
          id => id !== null && !employeeIdList.includes(id)
        );
        employeesToRemove.map(a => console.log("remove id +++++++++++++++++++" , a))
        employeesToAdd.map(a => console.log("insert id +++++++++++++++++++" , a))
        

        // Delete the assignments that are not in the new list
        if (employeesToRemove.length > 0) {
          for (const emplyId of employeesToRemove) {
          await AssignedTask.destroy({
            where: { taskId: task.id, emplyId: emplyId },
            transaction,
          });
        }
        }

        // Create new assignments for employees not already assigned
        for (const emplyId of employeesToAdd) {
          const assignedTask = await AssignedTask.create(
            {
              eventId,
              emplyId,
              taskId: task.id, // Use the ID of the updated task
            },
            { transaction }
          );

          if (!assignedTask) {
            throw new Error("Assigning task to employee was not successful!");
          }
        employeesToAdd.map(a => console.log("creating assgn task id --------------------------" ,  emplyId))

        }
      }

      // perform more operations within this transaction block
      

      // If all operations succeed, the transaction will be committed automatically
    });

    res.status(200).json({ message: "Task updated successfully!" });
  } catch (error) {
    console.error("Error in updateTask:", error);
    res
      .status(500)
      .json({ message: "Could not update the Task!", error: error });
  }
});


const searchTasksByTaskname= asyncHandler( async(req,res) => {
  const {taskName} =req.body;
  // const {taskName} =req.query;
  console.log("searching customer")
  console.log("taskName:((((((((((((((((((((())))))))))))))))))))) " );
  console.log("taskName:((((((((((((((((((((())))))))))))))))))))) " ,taskName);
  try {
    // { where: { eventId: eventId } }
      const data = await Task.findAll({
        where: {
          taskName: { 
            [Op.like]: `%${taskName}%`
          },
        },  
      });
      console.log("data "+ data);
      console.log( data);
       return res.status(200).json(data)  
  } catch (error) {
    console.log(error);
     return res.status(400).json({ error: error})
  // throw new Error(error.message || "can't find Customer") 
  }

})



const getSelectedDayTasks =  asyncHandler(async(req, res) =>{
  try {
    let { date  } = req.body;
    console.log("req =" , req.body);
    console.log("REceved date :" , date); 
    var todayWithOnedayOff = new Date(date);
    console.log("todayWithOnedayOff : " , todayWithOnedayOff);
    const today =  new Date( todayWithOnedayOff.getTime() + Math.abs(todayWithOnedayOff.getTimezoneOffset()*60000) );
    
  console.log("today  :" , today);
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  console.log("startOfDay :" , startOfDay);
  // console.log("start Of Day Fun:" , setToStartOfDay(today));
  // const todayStart = moment().startOf('day').toISOString();

  const todayBegin = new Date(setToStartOfDay(today));

  
  console.log("0.0.0. :", todayBegin); // Outputs: "2024-03-13T00:00:00.000Z"

  const endOfDay = new Date(today);
  endOfDay.setUTCHours(23, 59, 59, 999);
  console.log("endOfDay :" , endOfDay);


  
    await Task.findAll({
      where: {
        date: {
          [Op.between] : [todayBegin , endOfDay ]
        }
      }
      ,
      // include: [Customer]
    }).then((result) => res.status(200).json({ todayEvents: result }))
    .catch((error) => res.status(404).json({ error: error }));
  } catch (error) {
    res.status(404).json({ error: error });
  }
})

exports.getEmpAllowanceForSalary = asyncHandler(async (req, res) => {
  const id = req.query.id; // Assuming you're passing id as a route parameter
  const allowance = await EmpAllowance.findAndCountAll({
      where: {
          empId: id
      },
      include: [
          {
               model: AllowanceDeduction,  
               attributes: ['allowanceDeductionName','allowanceDeduction'], 
               where: {
                  allowanceDeduction: "Allowance"
              },
              }, 
          ],
  });
  if (allowance === null) {
      console.log('Allowance Record not found!');
      res.status(404).json({ error: 'Allowance Record not found' });
  } else {
      res.status(200).json(allowance);
  }
});

const getEmpAllowanceandSearch = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const empName = req.query.empName;
  const limit = 8;
  console.log("get Employee",page,empName,limit);
  let offset = limit * (page - 1)
  try {
      if(empName){
          const data = await Event.findAndCountAll({
              // where: {
              //     empName: { 
              //       [Op.like]: %${empName}%
              //     }
              //   },
              include: [
                  { 
                      model: paymentAllowanceDeduction,  
                      attributes: ['allowanceDeduction','allowanceDeductionName'],
                   },{ 
                      model: Employee,  
                      attributes: ['empName'], 
                      where: {
                          empName: { 
                            [Op.like]: `%${empName}%`
                          }
                        },
                  }],
              limit: limit,
              offset: offset,
              order: [['createdAt', 'DESC']]
          })
          res.status(200).json(data)
      }
      else{
          const data = await empallowance.findAndCountAll({
              include: [{ model: paymentAllowanceDeduction,  attributes: ['allowanceDeduction','allowanceDeductionName'], },{ model: Employee,  attributes: ['empName'], }],
              limit: limit,
              offset: offset,
              order: [['createdAt', 'DESC']]
          }) 
          console.log(data);
          res.status(200).json(data)
      }
      
     

  } catch (error) {
      res.status(400);
      throw new Error(error.message || "can't get allowance/deductions");
  }
})


// Define the deleteTask controller function
const deleteTask = asyncHandler(async (req, res) => {
  try {

    const { taskId } = req.query;
    // console.log(taskId)
    console.log("task get by id" , taskId);


    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    // Start a transaction
    await db.sequelize.transaction(async (transaction) => {
      // Delete associated records in AssignedTask table first
      await AssignedTask.destroy({
        where: { taskId: taskId },
        transaction
      });

      // Delete the task from Task table
      const rowsDeleted = await Task.destroy({
        where: { id: taskId },
        transaction
      });

      if (rowsDeleted === 0) {
        throw new Error("Task not found or already deleted");
      }

      // If all operations succeed, the transaction will be committed automatically
    });

    // Send success response
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteTask:", error.message);
    res.status(500).json({ message: "Could not delete the task!", error: error.message });
  }
});

module.exports = {
  getTaskById,
  getTaskById,
  createTask,
  getEventCategories,
  getTasksByEmployeeId,
  getAllTasks,
  getEmployeesByTaskId,
  updateTask,
  searchTasksByTaskname,
  getSelectedDayTasks,
  deleteTask
};

function setToStartOfDay(date) {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, milliseconds to 0
  return newDate;
}

const todayStart = setToStartOfDay(new Date()); // Get today's start in UTC
console.log(todayStart); // Output: 2024-03-13T00:00:00.000Z
