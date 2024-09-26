const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Op, findOrCreate, where } = require("sequelize");
const Employee = db.employees;
const Advance = db.advances;
const EmpAllowance = db.empallowance;
const Attendance = db.attendance;
const Department = db.departments;
const PaymentDetails = db.employeePaymentDetails;
const AllowanceDeduction = db.paymentAllowanceDeduction;
const PaySlips = db.payslips

exports.getEmployeesForSalary = asyncHandler(async (req, res) => {

    const id = req.query.id;

    console.log("get Employee",id);

    try {
            const data = await Employee.findOne({
                where: {
                    id: id
                  },
                  include: [
                    {
                      model: Department,
                      attributes: ['departmentName'],
                    
                    },
                    {
                        model: PaymentDetails,
                        attributes: ['empSalary','overtimeRate'],
                      
                      }
                  ],
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't get Employees");
    }
})


exports.getEmpAllowanceForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id; // Assuming you're passing id as a route parameter
    const date = req.query.date;
    const allowance = await EmpAllowance.findAndCountAll({
        where: {
            empId: id,
            date: { 
                [Op.like]: `${date}%`
              }
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

exports.getEmpDeductionForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id; // Assuming you're passing id as a route parameter
    const date = req.query.date;
    const allowance = await EmpAllowance.findAndCountAll({
        where: {
            empId: id,
            date: { 
                [Op.like]: `${date}%`
              }
        },
        include: [
            {
                 model: AllowanceDeduction,  
                 attributes: ['allowanceDeductionName','allowanceDeduction'], 
                 where: {
                    allowanceDeduction: "Deduction"
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

exports.getAdvanceForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const date = req.query.date;
    try {
        const advances = await Advance.findAndCountAll({
            where: 
        {
            reject: false,
            empId: id,
            monthtaken: date,
            advancerequest: false,
        }
        });
        if (!advances || advances.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(advances);
            console.log(advances)
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// exports.getAttendanceForSalary = asyncHandler(async (req, res) => {
//     const id = req.query.id;
//     try {
//         const  attendance  = await Attendance.findAndCountAll({
//             where: {
//                 id: id,
//                 date: { 
//                     [Op.like]: `${date}%`
//                   }
//             },
//         });

//         if (!attendance || attendance.length === 0) {
//             res.status(200).json([]);
//         } else {
//             res.status(200).json(attendance);
//             console.log(attendance)
//         }
//     } catch (error) {
//         console.error("Error fetching employees:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

exports.getOTForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const date = req.query.date;
    try {
        const  attendance  = await Attendance.sum('ot',{
            where: {
                id: id,
                date: { 
                    [Op.like]: `${date}%`
                  }
            },
        });

        if (!attendance || attendance.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(attendance);
            console.log(attendance)
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.getSumEmpAllowanceForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id; // Assuming you're passing id as a route parameter
    const date = req.query.date;

    const allowance = await EmpAllowance.sum('Amount', {
        where: {
            empId: id,
            date: {
                [Op.like]: `${date}%`
            }
        },
        include: [
            {
                model: AllowanceDeduction,
                attributes: [],
                where: {
                    allowanceDeduction: "Allowance"
                }
            }
        ]
    });

    if (allowance === null) {
        console.log('Allowance Record not found!');
        res.status(404).json({ error: 'Allowance Record not found' });
    } else {
        res.status(200).json({ sum: allowance });
    }
});

exports.getSumEmpDeductionForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id; // Assuming you're passing id as a route parameter
    const date = req.query.date;

    const allowance = await EmpAllowance.sum('Amount', {
        where: {
            empId: id,
            date: {
                [Op.like]: `${date}%`
            }
        },
        include: [
            {
                model: AllowanceDeduction,
                attributes: [],
                where: {
                    allowanceDeduction: "Deduction"
                }
            }
        ]
    });

    if (allowance === null) {
        console.log('Allowance Record not found!');
        res.status(404).json({ error: 'Allowance Record not found' });
    } else {
        res.status(200).json({ sum: allowance });
    }
});


exports.getSumAdvanceForSalary = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const date = req.query.date;
    try {
        const advances = await Advance.sum('advanceAmount',{
            where: 
        {
            reject: false,
            empId: id,
            monthtaken: date,
            advancerequest: false,
        }
        });
        if (!advances || advances.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(advances);
            console.log(advances)
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



exports.getEmployeeAllByid = asyncHandler(async (req, res) => { 
    const { id } = req.query; // Assuming you're passing id as a route parameter
    const employee = await Employee.findAll({
        where: {
            id: id,
        },
        attributes: [],
        include: [
            {
                model: PaymentDetails,
                attributes: ['empSalary'],
              //   where: {empDepartment: id }
              },{
                model: EmpAllowance,
                attributes: ['Amount'],
                include: [
                    {
                        model: AllowanceDeduction,
                        attributes: ['allowanceDeduction','allowanceDeductionName'],
                      }
                ]
              },{
                model: Advance,
                attributes: ['advanceAmount'],
              //   where: {empDepartment: id }
              },{
                model: PaySlips,
              },
          ],
    });
    if (employee === null) {
        console.log('Employee not found!');
        res.status(404).json({ error: 'Employee not found' });
    } else {
        res.status(200).json(employee);
    }
});



exports.generatePaySlip = asyncHandler(async (req, res) => {
    const {id} = req.query
    console.log(id);
    const { totalNetPay, grossDeductions, grossEarnings, otAmount, date} = req.body
    const [slip, created] = await PaySlips.findOrCreate({
        where: { id: id },
        defaults: {
            month : date,
            otAmount: otAmount,
            grossEarnings: grossEarnings,
            grossDeductions: grossDeductions,
            totalNetPay: totalNetPay,
        }
    });
    
    // console.log(emp); // 'sdepold'
    // console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
    // console.log(created); // The boolean indicating whether this instance was just created
    if (created) {
        res.status(201).json({ message: "Employee Created", slip });
    }else {
        console.log("Employee Exists");
        res.status(400).send({ message: "Employee already exist" });
    }
})