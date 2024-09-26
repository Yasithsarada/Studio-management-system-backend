const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Op, findOrCreate } = require("sequelize");
const Employee = db.employees;
const Advance = db.advances;



exports.createAdvance = asyncHandler(async (req, res) => {
      
    const { empId, advanceAmount } = req.body;
    const advance = await Advance.create({
            empId : empId,
            advanceAmount: advanceAmount,
    })
    res.status(200).json(advance);
    
    
});

exports.getAdvance = asyncHandler(async (req, res) => {
    // const page = req.params.page;
    // let limit = 4;
    // let offset = limit * (page - 1)
    try {
        const { count, rows } = await Advance.findAndCountAll({
            //   include: [{ model: Employee, where: { empId: id }, attributes: ['empName'], }],
            limit: 10,
            // limit: limit,
            // offset: offset,
        });

        const advances = rows;

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

exports.getAdvanceByid = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming you're passing id as a route parameter
    const advance = await Advance.findByPk(id);
    if (advance === null) {
        console.log('Advance Record not found!');
        res.status(404).json({ error: 'Advance Record not found' });
    } else {
        res.status(200).json(advance);
    }
});


exports.updateAdvance = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { newAdvancePaidAmount, newpaidstatus } = req.body;
    console.log(id, req.body,"update advance record")
    try {

        const data = await Advance.update({
            advancePaidAmount: newAdvancePaidAmount,
            advancePaidStatus: newpaidstatus
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