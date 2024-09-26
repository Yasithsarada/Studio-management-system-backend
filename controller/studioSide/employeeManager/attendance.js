const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize');
const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require("../../../config/db.config");
const Attendance = db.attendance;
const Employee = db.employees;


exports.createAttendance = asyncHandler(async (req, res) => {
      
      const {  id, checkIn, checkOut, dayType, leaveType, dateString, checkInSeconds, checkOutSeconds } = req.body;
      const diff = checkOutSeconds-checkInSeconds-28800;
      let ot
      if (diff>=0) {
         ot = diff
      }
      else{
         ot = 0;
      }
  
    //   var selectedDateWithOnedayOff = new Date(date);
    //   const correctedDate =  new Date( selectedDateWithOnedayOff.getTime() + Math.abs(selectedDateWithOnedayOff.getTimezoneOffset()*60000) );

      const [attendance, created] = await Attendance.findOrCreate({
          where: { id: id, date: dateString  },
          defaults: {
              checkIn : checkIn,
              checkOut: checkOut,
              dayType: dayType,
              leaveType: leaveType,
              checkInSeconds: checkInSeconds,
              checkOutSeconds: checkOutSeconds,
              ot: ot,
          }
      });
      
      // console.log(emp); // 'sdepold'
      // console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
      // console.log(created); // The boolean indicating whether this instance was just created
      if (created) {
          res.status(201).json({ message: "Attendance Record Created", attendance });
      }else {
          console.log("Employee Exists");
          res.status(400).send({ message: "Attendance Record already exist" });
      }
  });

exports.getAttendance = asyncHandler(async (req, res) => {
    const page = req.query.page;
    let limit = 8;
    let offset = limit * (page - 1)
    try {
        const  attendance  = await Attendance.findAndCountAll({
            include: [
                {
                  model: Employee,
                  attributes: ['empName'],
                }
              ],
              order: [['createdAt', 'DESC']],
            limit: 10,
            limit: limit,
            offset: offset,
        });

        // const attendance = [count,rows];

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



exports.getCheckInTotal = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;  // Access the id from query parameters
        const month = req.query.month;  // Access other parameters
        const data = await Attendance.sum('checkInSeconds', {
            where: {
                id: id,
                date: {
                    [Op.like]: `${month}%` 
                }
            }
        });
        if (data === null) {
            res.status(200).json({ totalCheckIns: 0 }); // Assuming you want to return 0 if no data found
        } else {
            res.status(200).json({ totalCheckIns: data });
        }
    } catch (error) {
        console.error("Error fetching CheckIn:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

exports.getCheckOutTotal = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;  // Access the id from query parameters
        const month = req.query.month;  // Access other parameters
        const data = await Attendance.sum('checkOutSeconds', {
            where: {
                id: id,
                date: {
                    [Op.like]: `${month}%` 
                }
            }
        });
        if (data === null) {
            res.status(200).json({ totalCheckOuts: 0 }); // Assuming you want to return 0 if no data found
        } else {
            res.status(200).json({ totalCheckOuts: data });
        }
    } catch (error) {
        console.error("Error fetching CheckIn:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



exports.getAttendanceandSearch = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const id = req.query.id;
    const date = req.query.date;
    const limit = 8;
    console.log("get Employee",page,id,limit);
    let offset = limit * (page - 1)
    try {
        if(id !== "None" && date !== "None" ){
            const data = await Attendance.findAndCountAll({
                where: {
                    id: id,
                    date: {
                        [Op.like]: `${date}%`
                    }
                  },
                  include: [
                    {
                      model: Employee,
                      attributes: ['empName'],
                    }
                  ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        else if (id !== "None") {
            const data = await Attendance.findAndCountAll({
                where: {
                    id: id,
                  },
                  include: [
                    {
                      model: Employee,
                      attributes: ['empName'],
                    }
                  ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        else{
            const data = await Attendance.findAndCountAll({
                where: {
                    date: {
                        [Op.like]: `${date}%`
                    },
                  },
                  include: [
                    {
                      model: Employee,
                      attributes: ['empName'],
                    }
                  ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        
       

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't get Employees");
    }
})
exports.getAttendenceCountToday = asyncHandler(async (req, res) => {
  const today = new Date();

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const formattedToday = formatDate(today);

  try {
    const { count, rows } = await Attendance.findAndCountAll({
      where: {
        date: {
          [Op.startsWith]: formattedToday,
        },
      },
      include: [
        {
          model: Employee,
          attributes: ['empName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Error fetching attendance count',
    });
  }
});



// exports.getCheckInTotal = asyncHandler(async (req, res) => {
//         const id = req.query.id;  // Access the id from query parameters
//     const month = req.query.sqlFormattedDate;  // Access other parameters

//         const data = await Attendance.findAll('checkIn', {
//             where: {
//                 id: id,
//                 date: {
//                     [Sequelize.Op.like]: `${month}%` 
//                 }
//             },
//             attributes: [
//                 [sequelize.fn('SUM', sequelize.fn('TIME_TO_SEC', sequelize.col('timeValue'))), 'totalSeconds']
//               ],
//             }).then(result => {
//               const totalSeconds = result[0].dataValues.totalSeconds;
//               console.log('Total seconds:', totalSeconds);
//             }).catch(err => {
//               console.error('Error:', err);
//             });
// });

// TimeModel.findAll({
//     attributes: [
//       [sequelize.fn('SUM', sequelize.fn('TIME_TO_SEC', sequelize.col('timeValue'))), 'totalSeconds']
//     ],
//   }).then(result => {
//     const totalSeconds = result[0].dataValues.totalSeconds;
//     console.log('Total seconds:', totalSeconds);
//   }).catch(err => {
//     console.error('Error:', err);
//   });
