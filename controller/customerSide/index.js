const asyncHandler = require("express-async-handler")
const db = require("../../config/db.config");
const Event = db.events;
const Customer =db.customers
const AssignedTasks=db.assignedTasks
const Services=db.services
const Employees=db.employees
const Tasks=db.tasks
exports.getEventCode = asyncHandler(async(req, res) => {
    const eventcode = req.params.eventcode
    console.log(eventcode);
    // const data = await AssignedTasks.findAll({
    //     where: { eventId : 1 },
    //     include: [
    //       {
    //         model:Event,
    //         include: [
    //             {
    //               model: Services,
    //             },
    //           ],
    //       },
    //       {
    //         model:Employees,
    //       },
    //       {
    //         model:Tasks,
    //       },
    //     ],
    //   })
    const data = await Tasks.findAll({
        where: { eventId : 1 },
        include: [
          {
            model:Event,
            include: [
                {
                  model: Services,
                },
              ],
          },
          {
            model:AssignedTasks,
            include: [
                {
                  model: Employees,
                },
              ],
          },
        ],
      })
    console.log(data);
    // .then((data) => {res.status(200).json(data)}).catch((err) => {
    //   res.status(500).json({ error: err})
    // })
    if(data) res.status(200).json(data)
    if(!data) res.status(400).json({error: error})
  });