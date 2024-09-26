const Sequelize = require('sequelize');
// const { DataTypes } = require(Sequelize);
require('dotenv').config();

// const server = process.env.AZURE_SQL_SERVER;
const server = "studio-server1.database.windows.net";
// const database = process.env.AZURE_SQL_DATABASE;
const database = "smsDB";
const port = 1433;
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USERNAME;
const password = process.env.AZURE_SQL_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  host: server,
  port: port,
  dialect: 'mssql',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const admin = require('../model/superAdmin/admin.model')(sequelize, Sequelize);
const users = require('../model/user.model')(sequelize, Sequelize);
const privileges = require('../model/superAdmin/privilege.model')(sequelize, Sequelize);
const departments=require("../model/superAdmin/department.model")(sequelize, Sequelize)

const customers = require('../model/customer/customer.model')(
  sequelize,
  Sequelize
);
const customerPayments = require('../model/customer/payment.model')(
  sequelize,
  Sequelize
);
const customerRequests = require('../model/customer/customerRequest.model')(
  sequelize,
  Sequelize
);

//const eventRequests=require("../model/customer/eventRequest.model")(sequelize, Sequelize)
const eventServices = require("../model/customer/eventService.model")(sequelize, Sequelize);
const eventRequests=require("../model/customer/eventRequest.model")(sequelize, Sequelize)

const services = require('../model/customer/service.model')(
  sequelize,
  Sequelize
);
const serviceInputFields = require('../model/customer/serviceInputField.model')(
  sequelize,
  Sequelize
);
const serviceInputFieldValues =
  require('../model/customer/serviceInputFieldValue.model')(
    sequelize,
    Sequelize
  );

const events = require('../model/eventManager/event.model')(
  sequelize,
  Sequelize
);
const tasks = require('../model/eventManager/task.model')(sequelize, Sequelize);
const assignedTasks = require('../model/eventManager/assignedTasks.model')(
  sequelize,
  Sequelize
);

const employees = require("../model/employeeManager/employee.model")(sequelize,Sequelize)
const employeePaymentDetails = require("../model/employeeManager/employeePaymentDetails.model")(sequelize,Sequelize)
const attendance = require("../model/employeeManager/attendance.model")(sequelize,Sequelize)


services.belongsTo(services, { as: 'parent', foreignKey: 'parentService' });

services.hasMany(serviceInputFields);
serviceInputFields.belongsTo(services);

serviceInputFields.hasMany(serviceInputFieldValues);
serviceInputFieldValues.belongsTo(serviceInputFields);

customers.hasMany(events);
events.belongsTo(customers);

services.hasMany(events);
events.belongsTo(services);

events.hasMany(tasks);
tasks.belongsTo(events);

// assignedTasks.belongsTo(tasks);
// assignedTasks.belongsTo(employees);

// tasks.hasMany(assignedTasks);
// employees.hasMany(assignedTasks)

//sequlize doc-yasith
// employees.belongsToMany(tasks, { through: assignedTasks });
// tasks.belongsToMany(employees, { through: assignedTasks });

assignedTasks.belongsTo(tasks, { foreignKey: 'taskId' });
assignedTasks.belongsTo(employees, { foreignKey: 'emplyId' });

tasks.hasMany(assignedTasks, { foreignKey: 'taskId' });
employees.hasMany(assignedTasks, { foreignKey: 'emplyId' });

events.hasMany(assignedTasks);
assignedTasks.belongsTo(events);

events.hasMany(customerPayments);
customerPayments.belongsTo(events);



// eventRequests.hasMany(customerPayments);
// customerPayments.belongsTo(eventRequests);
// event requests
// customers.hasMany(eventServices);
// eventServices.belongsTo(customers);

// eventRequests.hasMany(eventRequestServices);
// eventRequestServices.belongsTo(eventRequests);




// Associations
// eventRequests.hasMany(eventRequestServices, {
//   foreignKey: 'eventRequestServiceId',
//   onDelete: 'NO ACTION',
//   onUpdate: 'NO ACTION',
// });

// eventRequestServices.belongsTo(eventRequests, {
//   foreignKey: 'eventRequestServiceId',
//   onDelete: 'NO ACTION',
//   onUpdate: 'NO ACTION',
// });



events.hasMany(eventServices, {
  foreignKey: 'eventId',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
});

eventServices.belongsTo(events, {
  foreignKey: 'eventId',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
});

serviceInputFields.hasMany(eventServices, {
  foreignKey: 'serviceInputFieldId',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
});

eventServices.belongsTo(serviceInputFields, {
  foreignKey: 'serviceInputFieldId',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
});

db.customers = customers;
db.customerPayments = customerPayments;
db.customerRequests = customerRequests;

// db.eventRequests=eventRequests
db.eventServices=eventServices


db.services = services;
db.serviceInputFields = serviceInputFields;
db.serviceInputFieldValues = serviceInputFieldValues;

db.events = events;
db.tasks = tasks;
db.assignedTasks = assignedTasks;

const paymentAllowanceDeduction = require("../model/employeeManager/paymentAllowanceDeduction.model")(sequelize,Sequelize)
const advances = require("../model/employeeManager/advance.model")(sequelize,Sequelize)
const empallowance = require("../model/employeeManager/empallowance.model")(sequelize, Sequelize)
const payslips = require("../model/employeeManager/payslip.model")(sequelize,Sequelize)

/// 1:M
employees.hasMany(attendance, { foreignKey: 'id' });
attendance.belongsTo(employees, { foreignKey: 'id' });

employees.hasMany(advances, {foreignKey: 'empId'});
advances.belongsTo(employees, {foreignKey: 'empid'});

departments.hasMany(employees, {foreignKey: 'empDepartment'});
employees.belongsTo(departments, {foreignKey: 'empDepartment'});

paymentAllowanceDeduction.hasMany(empallowance, {foreignKey: 'allowanceid'})
empallowance.belongsTo(paymentAllowanceDeduction, {foreignKey: 'allowanceid'});

employees.hasMany(empallowance, {foreignKey: 'empId'});
empallowance.belongsTo(employees, {foreignKey: 'empId'});

employees.hasMany(payslips, {foreignKey: 'id'});
payslips.belongsTo(employees, {foreignKey: 'id'})


///1:1
employeePaymentDetails.belongsTo(employees, { foreignKey: 'id' });
employees.hasOne(employeePaymentDetails, { foreignKey: 'id' });

// admin.hasOne(employees, {
//   foreignKey: 'empEmail',
// });
// employees.belongsTo(admin, {
//   foreignKey: 'empEmail',
// });

employees.hasOne(admin, {
  foreignKey: 'empId',
});
admin.belongsTo(employees, {
  foreignKey: 'empId',
});

admin.hasOne(users, {
  foreignKey: 'empId',
});
users.belongsTo(admin, {
  foreignKey: 'empId',
});

employees.hasMany(privileges, { foreignKey: 'empId' });
privileges.belongsTo(employees, { foreignKey: 'empId' });


// admin.belongsToMany(users, { through: adminPrivilege });
// users.belongsToMany(admin, { through: adminPrivilege });  

db.paymentAllowanceDeduction = paymentAllowanceDeduction;
db.employees = employees;
db.employeePaymentDetails = employeePaymentDetails;
db.attendance = attendance;
db.advances = advances;
db.empallowance = empallowance;
db.payslips = payslips;

db.admin = admin;
db.users=users
db.privileges=privileges
db.departments=departments

module.exports = db;
