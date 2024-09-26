const express =require('express');
const { createEvent, updateEvent,updateEventConfirm, allEvents, test, filterEventsBetween, getOnedayEvents, getTodayEvents, getSelectedDayEvents, getCustomer, getEvent, getAllEmployees } = require('../../../controller/studioSide/eventManager/eventManager');
const router = express.Router();
const db = require("../../../config/db.config");
const { createTask, getEventCategories, getTasksByEmployeeId, getAllTasks, getTaskById, getEmployeesByTaskId, updateTask1, updateTask, searchTasksByTaskname, getSelectedDayTasks, deleteTask } = require('../../../controller/studioSide/eventManager/task');
const { createAssignedTask } = require('../../../controller/studioSide/eventManager/assignedTasks');
const { signInUser } = require('../../../model/eventManager/userCtrl');
const { getEmployeesandSearch } = require('../../../controller/studioSide/eventManager/mobileaApp');
//event Manager
router.get("/Filter/Between",filterEventsBetween);
router.get("/getOnedayEvents", getOnedayEvents);
router.get("/todayEvent", getTodayEvents);
router.post("/selectedDayEvents", getSelectedDayEvents);
router.post("/event", createEvent);
router.get("/all-events", allEvents);
router.post("/getCustomer",getCustomer);
router.get("/eventDetails/:eventId",getEvent);

router.put("/updateEvent/:id", updateEvent);

router.get("/eventManager/searchEvent",);
router.get("/eventManager/FilterEvents/:status",);
router.get("/eventManager/eventRequests",);
router.get("/eventManager/eventCalandar",);
router.get("/eventManager/assignEmployee/:id",);
router.get("/eventManager/events",);


router.put("/updateEventConfirmed/:id", updateEventConfirm);
//-----------Tasks routes---------------
router.post("/tasks/create", createTask);
router.post("/tasks/assigned-Task/create", createAssignedTask);
router.post("/tasks/updateTask/", updateTask);
router.get("/all-employees", getAllEmployees);
router.get("/event-categories", getEventCategories);
router.get("/tasks/all-tasks", getAllTasks);
router.get('/tasks/task-dettail/', getTaskById);
router.get("/task/assigned-employees/:taskId", getEmployeesByTaskId);
router.post("/task/searchTaskName", searchTasksByTaskname);
router.post("/task/searchTaskDate", getSelectedDayTasks);
router.post("/task/deleteTask", deleteTask);

//-----------Assigned Task routes---------------
router.get("/employee-asignedTasks", getTasksByEmployeeId);


//-----------Other routes---------------
router.post("/employee/logIn", signInUser);
router.get("/employee/EmployeesandSearch", getEmployeesandSearch);



module.exports = router;