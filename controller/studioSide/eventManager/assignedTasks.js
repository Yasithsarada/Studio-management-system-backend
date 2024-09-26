const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const AssignedTask = db.assignedTasks;
const { Sequelize } = require("sequelize");




const createAssignedTask = asyncHandler(async (req, res) => {
  console.log("ggggg-------------------------------------------------------------------")
  const { eventId, employeeIdList, taskId } = req.body;
  console.log("eventId:", eventId, "employeeIdList:", employeeIdList, "taskId:", taskId);

  try {
    await db.sequelize.transaction(async (transaction) => {
      const promises = employeeIdList.map(empId => 
        AssignedTask.create({
          eventId,
          emplyId : empId,
          taskId,
        }, { transaction })
      );

      const results = await Promise.all(promises);

      // Check if any assignment was not successful
      if (results.some(result => !result)) {
        throw new Error("Task assigning was not successful!");
      }
    });

    res.status(200).json({ message: "Task assigned successfully!" });
  } catch (error) {
    console.error("Error in transaction:", error.message);
    res.status(500).json({ message: "Task assigning was not successful!", error: error.message });
  }
});


module.exports = {
    createAssignedTask
}