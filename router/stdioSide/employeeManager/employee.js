const express =require('express');
const { createEmployee, getEmployees, getEmployeeByid, updateEmployee, deleteEmplloyee, deleteEmployee, getEmployeesandSearch, getEmployeeSearch } = require('../../../controller/studioSide/employeeManager/employee');
const { createEmployeePaymentDetails, getEmployeePaymentDetailsByid, updateEmployeePaymentDatails, getEmployeeSearchViewPaymentDetails } = require('../../../controller/studioSide/employeeManager/employeePaymentDetails');
const { createAttendance, getAttendance, getCheckInTotal, getCheckOutTotal, getAttendanceandSearch, getAttendenceCountToday } = require('../../../controller/studioSide/employeeManager/attendance');
const { createAllowanceDeduction, getAllowance, deleteAllowance, getAllowanceByType, createEmpAllowance, getEmpAllowanceandSearch, getempAllowance, getEmpAllowanceByid, updateEmpAllowance} = require('../../../controller/studioSide/employeeManager/allowanceDeduction');
const { createAdvance, getAdvance, getAdvanceByid, updateAdvance, acceptAdvance, rejectAdvance, getRejectAdvance, getEmployeesandSearchForAdvance, getAdvanceForEmployee } = require('../../../controller/studioSide/employeeManager/advance');
// const { createAdvance, getAdvance, getAdvanceByid, updateAdvance, } = require("../../../controller/studioSide/employeeManager/payment")
const {getEmployeesForSalary, getEmpAllowanceForSalary, getEmpDeductionForSalary, getAdvanceForSalary, getOTForSalary, getSumAdvanceForSalary, getSumEmpAllowanceForSalary, getSumEmpDeductionForSalary, getEmployeeAllByid, generatePaySlip} = require('../../../controller/studioSide/employeeManager/salary');
const router = express.Router();

//// Employee

router.post("/registerEmployee", createEmployee);
router.get("/getEmployees", getEmployees);
router.get("/getEmployeeByid/:id", getEmployeeByid);
router.put("/updateEmployee/:id", updateEmployee);
router.delete("/deleteEmployee/:id",deleteEmplloyee);
router.get("/getEmployeesandSearch", getEmployeesandSearch);
// router.delete("/deleteEmployee/:id",deleteEmployee);
router.get("/getEmployeesandSearch", getEmployeesandSearch);
router.get("/getEmployeeSearch", getEmployeeSearch);

////// Payment

router.post("/registerEmployeePaymentDetails", createEmployeePaymentDetails);
router.get("/getEmployeePaymentDetailsByid/:id", getEmployeePaymentDetailsByid);
router.put("/updateEmployeePaymentDatails/:id", updateEmployeePaymentDatails);
router.get("/getEmployeeSearchViewPaymentDetails",getEmployeeSearchViewPaymentDetails);


//Advance

router.post("/createAdvance", createAdvance);
router.get("/getAdvance",getAdvance);
router.get("/getAdvanceByid/:id", getAdvanceByid);
router.put("/updateAdvance/:id", updateAdvance);
router.put("/acceptAdvance/:id", acceptAdvance);
router.put("/rejectAdvance/:id", rejectAdvance);
router.get("/getRejectAdvance", getRejectAdvance);
router.get("/getEmployeesandSearchForAdvance", getEmployeesandSearchForAdvance);


// Allowance
router.post("/createAllowanceDeduction", createAllowanceDeduction);
router.get("/getAllowance", getAllowance);
router.delete("/deleteAllowance/:id", deleteAllowance);
router.get("/getAllowanceByType", getAllowanceByType);
router.post("/createEmpAllowance", createEmpAllowance);


//// EmpAllowance
router.get("/getEmpAllowanceandSearch", getEmpAllowanceandSearch);
router.get("/getEmpAllowance", getempAllowance);
router.get("/getEmpAllowanceByid", getEmpAllowanceByid);
router.put("/updateEmpAllowance", updateEmpAllowance);


///////Salary
router.get("/getEmployeesForSalary", getEmployeesForSalary);
router.get("/getEmpAllowanceForSalary", getEmpAllowanceForSalary);
router.get("/getEmpDeductionForSalary", getEmpDeductionForSalary);
router.get("/getAdvanceForSalary", getAdvanceForSalary);
router.get("/getOTForSalary", getOTForSalary);
router.get("/getSumAdvanceForSalary", getSumAdvanceForSalary);
router.get("/getSumEmpAllowanceForSalary", getSumEmpAllowanceForSalary);
router.get("/getSumEmpDeductionForSalary", getSumEmpDeductionForSalary);
router.get("/getEmployeeAllByid", getEmployeeAllByid);
router.post("/generatePaySlip", generatePaySlip);





//// Attendance

router.post("/createAttendance", createAttendance);
router.get("/getAttendance", getAttendance);
router.get("/getCheckInTotal", getCheckInTotal);
router.get("/getCheckOutTotal", getCheckOutTotal);
router.get("/getAttendanceandSearch", getAttendanceandSearch);
router.get('/getAttendenceCountToday', getAttendenceCountToday);




router.get("/getAdvanceForEmployee",getAdvanceForEmployee);




module.exports =router ;