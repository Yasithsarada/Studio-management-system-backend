const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Op, findOrCreate, where } = require("sequelize");
const paymentAllowanceDeduction = db.paymentAllowanceDeduction;
const empallowance = db.empallowance;
const Employee = db.employees;
const Allowances = db.paymentAllowanceDeduction;

exports.createAllowanceDeduction = asyncHandler(async (req, res) => {
    const { allowanceorDeduction, allowanceDeductionName } = req.body
    const [record, created] = await paymentAllowanceDeduction.findOrCreate({
        where: { allowanceDeduction: allowanceorDeduction,
            allowanceDeductionName: allowanceDeductionName
         },
        defaults: {
            allowanceDeduction : allowanceorDeduction,
            allowanceDeductionName: allowanceDeductionName,
        }
    });
    
    // console.log(emp); // 'sdepold'
    // console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
    // console.log(created); // The boolean indicating whether this instance was just created
    if (created) {
        res.status(201).json({ message: "Record Created", record });
    }else {
        console.log("Employee Exists");
        res.status(400).send({ message: "Record already exist" });
    }
})


exports.getAllowance = asyncHandler(async (req, res) => {
    const page = req.query.page;
    let limit = 8;
    let offset = limit * (page - 1)
    try {
        const allowance = await paymentAllowanceDeduction.findAndCountAll({
            //   include: [{ model: Employee, where: { empId: id }, attributes: ['empName'], }],
            // limit: 10,
            limit: limit,
            offset: offset,
        });

        // const allowance = rows;

        if (!allowance || allowance.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(allowance);
            console.log(allowance)
        }
    } catch (error) {
        console.error("Error fetching Allowance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.getAllowanceByid = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming you're passing id as a route parameter
    const allowance = await paymentAllowanceDeduction.findByPk(id);
    if (allowance === null) {
        console.log('Allowance Record not found!');
        res.status(404).json({ error: 'Allowance Record not found' });
    } else {
        res.status(200).json(advance);
    }
});


exports.deleteAllowance = asyncHandler(async (req, res) => {

    const id = req.params.id
    if (!id) {
        res.status(400).send({ message: "Allowance not found" });
        return
    }
    try {

        const data = await paymentAllowanceDeduction.destroy({
            where: { id: id },
            // returning: true
        })
        return res.status(200).json({ message: "Allowance deleted successfully" });

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Couldn't remove Allowance");
    }


})



exports.getAllowanceByType = asyncHandler(async (req, res) => {
    const type = req.query.type;
    try {
        const { count, rows } = await paymentAllowanceDeduction.findAndCountAll({
              where:{allowanceDeduction: type}
        });

        const allowance = rows;

        if (!allowance || allowance.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(allowance);
            console.log(allowance)
        }
    } catch (error) {
        console.error("Error fetching Allowance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


exports.createEmpAllowance = asyncHandler(async (req, res) => {
    const { id, empId, amount, date } = req.body
    const record = await empallowance.create({
        allowanceid: id,
        empId: empId,
        Amount: amount,
        date: date,
    });
    if (record) {
        res.status(201).json({ message: "Record Created", record });
    }else {
        console.log("Employee Exists");
        res.status(400).send({ message: "Record already exist" });
    }
})

exports.getEmpAllowanceandSearch = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const empName = req.query.empName;
    const limit = 8;
    console.log("get Employee",page,empName,limit);
    let offset = limit * (page - 1)
    try {
        if(empName){
            const data = await empallowance.findAndCountAll({
                // where: {
                //     empName: { 
                //       [Op.like]: `%${empName}%`
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

exports.getempAllowance = asyncHandler(async (req, res) => {
    // const page = req.params.page;
    // let limit = 4;
    // let offset = limit * (page - 1)
    try {
        const { count, rows } = await empallowance.findAndCountAll({
              include: [{ model: paymentAllowanceDeduction,  attributes: ['allowanceDeductionName'], }],
            limit: 10,
            // limit: limit,
            // offset: offset,
        });

        const allowance = rows;

        if (!allowance || allowance.length === 0) {
            res.status(200).json([]);
        } else {
            res.status(200).json(allowance);
            console.log(allowance)
        }
    } catch (error) {
        console.error("Error fetching Allowance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


exports.getEmpAllowanceByid = asyncHandler(async (req, res) => {
    const id = req.query.id; // Assuming you're passing id as a route parameter
    const allowance = await empallowance.findByPk(id, {
        include: [{ model: paymentAllowanceDeduction,  attributes: ['allowanceDeduction','allowanceDeductionName'], },{ model: Employee,  attributes: ['empName'], }],
    });
    if (allowance === null) {
        console.log('Allowance Record not found!');
        res.status(404).json({ error: 'Allowance Record not found' });
    } else {
        res.status(200).json(allowance);
    }
});

exports.updateEmpAllowance = asyncHandler(async (req, res) => {
    const allowanceid = req.query.id;
    const Amount = req.query.amount;
    const id = req.query.empId;
    // const { id, amount, empId } = req.body;
    console.log(id, req.body,"update employee")
    console.log(Amount);
    console.log(allowanceid);
    const updateData = {
        id: id,
        Amount: Amount,
        allowanceid: allowanceid,
    }
    console.log(updateData);
    try {
        const data = await empallowance.update(updateData, {
            where: { id: id },
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't update Employee");
    }
})





// exports.updateAllowance = asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const { newAdvancePaidAmount, newpaidstatus } = req.body;
//     console.log(id, req.body,"update advance record")
//     try {

//         const data = await paymentAllowanceDeduction.update({
//             advancePaidAmount: newAdvancePaidAmount,
//             advancePaidStatus: newpaidstatus
//         }, {

//             where: { id: id },
//             // returning: true,
//         })
//         res.status(200).json(data)
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message || "can't update Advance Record");
//     }
// })