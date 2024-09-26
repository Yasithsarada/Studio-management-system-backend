const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
// const Event = require("../../../model/eventManager/event.model");
const Event = db.events;

const { Op, Sequelize } = require("sequelize");
const crypto = require("crypto");
let existingEvent;
const Customer = db.customers;
const Employee = db.employees;

const EventServices = db.eventServices;

const Service = db.services;

const createEvent = asyncHandler(async (req, res) => {
  console.log("yyyyyyyyyyyyyyyy");
  try {

    
    const {  serviceType, status, customerId } = req.body;
    let { date} = req.body;
    console.log("date log: " , date);
    // date

    var selectedDateWithOnedayOff = new Date(date);
    const correctedDate =  new Date( selectedDateWithOnedayOff.getTime() + Math.abs(selectedDateWithOnedayOff.getTimezoneOffset()*60000) );
    // Validate input fields
    // if (!eventId || !serviceType || !status || !date || !customerId) {
      //   return res.status(400).json({ message: "Please fill out all the fields!" });
      // }
      const  eventId = generateId()
      console.log("serviceType: ", serviceType);
      console.log("status: ", status);
      console.log("date: ", date);
      console.log("corrected date: ", correctedDate);
      console.log("eveent id: ", eventId);
      console.log("custormer : ", customerId);
   
      console.log("{} event ID :" ,eventId);
      if(eventId){
      existingEvent = await Event.findOne({ where: { eventId: eventId } })
      // .then(function (event) {
      //   console.log("Eveent B : ", event ) ;
      // return res.status(400).json({ message: "Event already exists"  , existingEvent : existingEvent });

      // }).catch(function (error) {
      //   console.log( "Event B error: ", error);
      // })

    // eventId = "gnsiphnsiphins";
      }
    console.log("existing ev :" ,existingEvent);
   
    if (existingEvent) {
      console.log("existing event :" ,existingEvent);
      return res.status(400).json({ message: "Event already exists"  , existingEvent : existingEvent });
    }

    // Create the event
    const event = await Event.create({
     
      eventId : eventId,
      serviceType,
      status,
      date : correctedDate,//By calling toISOString() on the correctedDate, you ensure that the date field is stored as a string in the format expected by Sequelize.
      customerId,
    });
    if(!event) res.status(400).json({ message: "Event creation was not successful!" });
    // Send a success response
    res.status(200).json({event: event});
  } catch (error) {
    console.log("error :", error);
    // Send an error response
    res.status(500).json({ message: "Could not create the event!" , error: error  });
  }
});

const updateEventConfirm =  asyncHandler(async( req ,res ) => {
try {
  const id = req.params.id;
    const {  status } = req.body;
    console.log(id,status);
    const confirmedEvent = await Event.update({status:status} , {where :{id : id}})
    res.send(confirmedEvent)
} catch (error) {
  res.status(400).json({ message: error.message });
}
})

const updateEvent=asyncHandler(async(req, res) =>{
  console.log(req.body);
 
  try {
    const {id,note,amount,payment,offers,serviceDate,eventServices}=req.body
    const confirmedEvent = await Event.update({note,amount,payment,offers,serviceDate,eventServices}, {where :{id : id}})
    .then((event)=>{
      eventServices.forEach((element) => {
      
        console.log(element);
        EventServices.update({value:element.value}, {where :{id :element.id}}).then((data)=>{
         
         }

        )
    })}
    
    )
    res.send("ok")
  } catch (error) {
    
  }

})

const allEvents = asyncHandler(async(req, res) =>{
 try {
   const events = await Event.findAll( { 
    include: [ {model :Customer} ,{model : Service}]
  }

   );
  //  include: [{ model: Employee }, { model: Task }],
   if(!events) res.status(400).json({ message: "Could not get events !"});
 res.status(200).json({events : events})
 } catch (error) {
  res.status(400).json({ message: error.message });
 }
})



// const filterEventsBetween = asyncHandler(async(req, res) =>{

//   const startedDate = new Date("2024-02-28T18:30:00.000Z");
//   const endDate = new Date("2024-03-09T18:30:00.000Z");
  
//   // Format the dates to match the database format
//   const formatDatabaseDate = (date) => {
//     return date.toISOString();
//   };
  
//   const formattedStartDate = formatDatabaseDate(startedDate);
//   const formattedEndDate = formatDatabaseDate(endDate);
  
//   // Find events between the specified dates
//   Event.findAll({
//     where: {
//       date: {
//         [Op.between]: [formattedStartDate, formattedEndDate],
//       },
//     },
//   })
//     .then((result) => res.status(200).json({ data: result }))
//     .catch((error) => res.status(404).json({ errorInfo: error }));
// })
const filterEventsBetween = asyncHandler(async (req, res) => {
  const startedDate = new Date("2024-02-28T18:30:00.000Z");
  const endDate = new Date("2024-03-09T18:30:00.000Z");

  // Format the dates to match the database format
  const formatDatabaseDate = (date) => {
    return date.toISOString();
  };

  const formattedStartDate = formatDatabaseDate(startedDate);
  const formattedEndDate = formatDatabaseDate(endDate);

  // Find events between the specified dates
  Event.findAll({
    where: {
      serviceDate: {
        [Op.between]: [formattedStartDate, formattedEndDate],
      },
    },
  })
    .then((result) => res.status(200).json({ data: result }))
    .catch((error) => res.status(404).json({ errorInfo: error }));
});


const getOnedayEvents = asyncHandler(async (req, res) => {
  await Event.findAll({
    where: {
      serviceType: "one day services"
    },
    include: [Customer]
  })
    .then((result) => res.status(200).json({ oneDayEvents: result }))
    .catch((error) => res.status(404).json({ error: error }));

   
    // var datetime = new Date();
    // console.log(datetime);
});

// const getTodayEvents =  asyncHandler(async(req, res) =>{
//   try {
//     var todayWithOnedayOff = new Date();
//     console.log("todayWithOnedayOff : " , todayWithOnedayOff);
//     const today =  new Date( todayWithOnedayOff.getTime() + Math.abs(todayWithOnedayOff.getTimezoneOffset()*60000) );
    
//   console.log("today  :" , today);
//   const startOfDay = new Date(today);
//   startOfDay.setHours(0, 0, 0, 0);
//   console.log("startOfDay :" , startOfDay);
//   // console.log("start Of Day Fun:" , setToStartOfDay(today));
//   // const todayStart = moment().startOf('day').toISOString();

//   const todayBegin = new Date(setToStartOfDay(today));
// console.log("todayBegin  :" ,todayBegin)
  
//   console.log("0.0.0. :", todayBegin); // Outputs: "2024-03-13T00:00:00.000Z"

//   const endOfDay = new Date(today);
//   endOfDay.setUTCHours(23, 59, 59, 999);
//   console.log("endOfDay :" , endOfDay);


  
//     const events = await Event.findAll({
//       where: {
//         serviceDate: {
//           [Op.between] : [todayBegin , endOfDay ]
//         }
//       }
//     }).then((result) => {
//       console.log("result 88888888888888888888888888888888 :" , events);
//       return res.status(200).json({ todayEvents: result });
  
//   })
//     .catch((error) => res.status(404).json({ error: error }));
//   } catch (error) {
//     res.status(404).json({ error: error });
//   }
// })

const getTodayEvents = asyncHandler(async (req, res) => {
  try {
    // Get current date and time
    const now = new Date();

    // Set the start of today in the server's local time zone
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Set the end of today in the server's local time zone
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert both to UTC for database query
    const todayBegin = new Date(startOfDay.toISOString());
    const todayEnd = new Date(endOfDay.toISOString());

    console.log("todayBegin:", todayBegin); // Should log 2024-07-03T00:00:00.000Z
    console.log("todayEnd:", todayEnd); // Should log 2024-07-03T23:59:59.999Z

    // Fetch events from the database
    const events = await Event.findAll({
      where: {
        serviceDate: {
          [Op.between]: [todayBegin, todayEnd],
        },
      },
      include: [
        {
          model: Customer,
          // attributes: ['id','departmentName'],
        //   where: {empDepartment: id }
        },
        {model :Service}
      ]
    });

    console.log("result 88888888888888888888888888888888 :", events);
    return res.status(200).json({ todayEvents: events });

  } catch (error) {
    console.error("Error fetching today's events:", error);
    return res.status(500).json({ error: error.message });
  }
});




const getSelectedDayEvents =  asyncHandler(async(req, res) =>{
  try {
    let { date  } = req.body;
    console.log("req =" , req.body);
    console.log("REceved date :" , date); 
    var todayWithOnedayOff = new Date(date);
    console.log("todayWithOnedayOff : " , todayWithOnedayOff);
    const today =  new Date( todayWithOnedayOff.getTime() + Math.abs(todayWithOnedayOff.getTimezoneOffset()*60000) );
    
  console.log("today  :" , today);
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  console.log("startOfDay :" , startOfDay);
  // console.log("start Of Day Fun:" , setToStartOfDay(today));
  // const todayStart = moment().startOf('day').toISOString();

  const todayBegin = new Date(setToStartOfDay(today));

  
  console.log("0.0.0. :", todayBegin); // Outputs: "2024-03-13T00:00:00.000Z"

  const endOfDay = new Date(today);
  endOfDay.setUTCHours(23, 59, 59, 999);
  console.log("endOfDay :" , endOfDay);


  
    await Event.findAll({
      where: {
        date: {
          [Op.between] : [todayBegin , endOfDay ]
        }
      }
      ,
      include: [Customer]
    }).then((result) => res.status(200).json({ todayEvents: result }))
    .catch((error) => res.status(404).json({ error: error }));
  } catch (error) {
    res.status(404).json({ error: error });
  }
})


const getCustomer= asyncHandler( async(req,res) => {
  console.log("searching customer")
  const {mobilePhone} =req.body;
  console.log(mobilePhone);
  try {
    // { where: { eventId: eventId } }
      const data = await Customer.findAll({
        where: {
          mobilePhone: { 
            [Op.like]: `%${mobilePhone}%`
          },
        },  
      });
      console.log("data "+ data);
      console.log( data);
        res.status(200).json(data)  
  } catch (error) {
      res.status(400)
  throw new Error(error.message || "can't find Customer") 
  }

}

)

const getEvent = asyncHandler(async(req, res) => {
  const { eventId } = req.params;
  console.log(eventId);
  const data = await Event.findOne({ where: { eventId: eventId } ,include :[Customer]  })
  // .then((data) => {res.status(200).json(data)}).catch((err) => {
  //   res.status(500).json({ error: err})
  // })
  if(data) res.status(200).json(data)
  if(!data) res.status(400).json({error: error})
});

function setToStartOfDay(date) {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, milliseconds to 0
  return newDate;
}

const todayStart = setToStartOfDay(new Date()); // Get today's start in UTC
console.log(todayStart); // Output: 2024-03-13T00:00:00.000Z






const generateId = ()=>{
  // Generate random bytes
  const randomBytes = crypto.randomBytes(16);

  // Encode the random bytes in base64 and replace special characters
  const generateId = randomBytes.toString("base64").replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');

  console.log("generateId : " , generateId);
  return generateId;

}



const getAllEmployees = asyncHandler(async(req, res) =>{
  try {
    const employees = await Employee.findAll( { include: [Employee]});
    if(!employees) res.status(400).json({ message: "Could not get employees !"});
  res.status(200).json({employees : employees})
  } catch (error) {
   res.status(400).json({ message: error.message });
  }
 })

 const getEmployees = asyncHandler(async (req, res) => {
  // const page = req.params.page;
  // let limit = 4;
  // let offset = limit * (page - 1)
  try {
      const { count, rows } = await Employee.findAndCountAll({
          limit: 10,
          // limit: limit,
          // offset: offset,
      });

      const employees = rows;

      if (!employees || employees.length === 0) {
          res.status(200).json([]);
      } else {
          res.status(200).json(employees);
          console.log(employees)
      }
  } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

const getEmpAllowanceandSearch = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const empName = req.query.empName;
  const limit = 8;
  console.log("get Employee",page,empName,limit);
  let offset = limit * (page - 1)
  try {
      if(empName){
          const data = await Event.findAndCountAll({
              // where: {
              //     empName: { 
              //       [Op.like]: %${empName}%
              //     }
              //   },
              include: [
                  { 
                      model: paymentAllowanceDeduction,  
                      attributes: ['allowanceDeduction','allowanceDeductionName'],
                   },{ 
                      model: Customer,  
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



 const getAllEventTypes = asyncHandler(async(req, res) =>{
  let eventTypes = [];

 })

 

module.exports = {
  createEvent,
  updateEvent,
  allEvents,
  filterEventsBetween,
  getOnedayEvents,
  getTodayEvents,
  getSelectedDayEvents,
  getCustomer,
  getEvent,
  getAllEmployees,
  updateEventConfirm
};







