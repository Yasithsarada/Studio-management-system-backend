const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Op, findOrCreate, where } = require("sequelize");
const Employee = db.employees;
const Advance = db.advances;
const PaymentDetails = db.employeePaymentDetails



exports.createAdvance = asyncHandler(async (req, res) => {

    try {
        const { empId } = req.query;
        console.log("getAdvanceForEmployee -------------------------" , empId);

        const {  advanceAmount, description } = req.body;
        let { advancerequest } = req.body
        const emplsalary = await PaymentDetails.findOne({
            where: {
                id: empId
            },
            attributes: ['empSalary']
        });
        const salary = emplsalary.empSalary
        const newSalary = salary/3
        console.log(salary);
        if (advanceAmount<newSalary) {

                    const reject = false;
            if (!advancerequest) {
                advancerequest=0;
            }
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                return `${year}-${month}`;
            };
            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);
            const advance = await Advance.create({
                    empId : empId,
                    advanceAmount: advanceAmount,
                    description: description,
                    monthtaken: formattedDate,
                    advancerequest: advancerequest,
                    reject: reject
            })
           return res.status(200).json(advance);


        } else {

            res.status(500).json({ error: "Advance cannot exceed 1/3 salary" });

        }

    } catch (error) {
     console.log("eroor heeeeeeee" , error)
    }
     
     
 });

exports.getAdvance = asyncHandler(async (req, res) => {
    const page = req.query.page;
    let limit = 8;
    let offset = limit * (page - 1)
    console.log(page);
    try {
        const advances = await Advance.findAndCountAll({
            where: 
        {
            reject: false,
        },include: [
            {
              model: Employee,
              attributes: ['empName'],
            }
          ],
          limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]

        });

        // const advances = rows;

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


exports.getRejectAdvance = asyncHandler(async (req, res) => {
    const page = req.query.page;
    let limit = 8;
    let offset = limit * (page - 1)
    try {
        const advances = await Advance.findAndCountAll({
            where: 
        {
            reject: true,
        },include: [
            {
              model: Employee,
              attributes: ['empName'],
            }
          ],
        },{
            //   include: [{ model: Employee, attributes: ['empName'], }],
            // limit: 10,
            limit: limit,
            offset: offset,
        });

        // const advances = rows;

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


exports.getEmployeesandSearchForAdvance = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const empName = req.query.empName;
    const limit = 8;
    console.log("get Employee",page,empName,limit);
    let offset = limit * (page - 1)
    try {
        if(empName){
            const data = await Employee.findAndCountAll({
                where: {
                    empName: { 
                      [Op.like]: `%${empName}%`
                    }
                  },
                  include: [
                    {
                      model: PaymentDetails,
                    //   where: {
                    //     empSalary: {
                    //         [Op.not]: null,
                    //     }
                    //   }
                    }
                  ],
                // limit: limit,
                // offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        else{
            const data = await Employee.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            }) 
            console.log(data);
            res.status(200).json(data)
        }
        
       

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't get Employees");
    }
})

exports.getAdvanceByid = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming you're passing id as a route parameter
    console.log(id);
    const advance = await Advance.findOne({
        where: 
        {
            id: id,
        }
    }
        ,{
        // include: [{ model: Employee, attributes: ['empName'], }],
    }
);
    if (advance === null) {
        console.log('Advance Record not found!');
        res.status(404).json({ error: 'Advance Record not found' });
    } else {
        res.status(200).json(advance);
    }
});


exports.updateAdvance = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { advanceAmount, description } = req.body;
    console.log(id, req.body,"update advance record")
    try {

        const data = await Advance.update({
            advanceAmount: advanceAmount,
            description: description
        }, {

            where: { id: id },
            // returning: true,
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't update Advance Record");
    }
})

exports.acceptAdvance = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const advancerequest = false;
    // const advancerequest = req.body;
    console.log(id, req.body,"accept advance record")
    try {

        const data = await Advance.update({
            advancerequest: advancerequest,
        }, {

            where: { id: id },
            // returning: true,
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't update Advance Record");
    }
})


exports.rejectAdvance = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const advancerequest = false;
    const reject = true;
    // const { advancerequest, reject } = req.body;
    console.log(advancerequest);
    console.log(reject);
    console.log(id, req.body,"reject advance record")
    try {

        const data = await Advance.update({
            advancerequest: advancerequest,
            reject: reject
        }, {

            where: { id: id },
            // returning: true,
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't update Advance Record");
    }
})
exports.getAdvanceForEmployee = asyncHandler(async (req, res) => {
    try {
        const { id } = req.query;
        console.log("getAdvanceForEmployee -------------------------" , id);
      if (!id) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }
      
      const advance = await Advance.findAll({
        where: { empId: id },
      });
    
      console.log("advanceeeeee ", advance);
      if (!advance.length) {
        return res.status(404).json({ error: 'Advance Record not found' });
      } else {
        return res.status(200).json({ rows: advance });
      }
    } catch (error) {
      console.log("errorrrrrrrrrrrrrrrrrrrr", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  



