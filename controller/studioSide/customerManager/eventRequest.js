const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Op, where } = require("sequelize");
const EventRequests = db.eventRequests;
const Events = db.events;
const EventServices = db.eventServices;
const ServiceInputFields = db.serviceInputFields;
const Customer = db.customers;
const Services = db.services;

exports.createEventRequest = asyncHandler(async (req,res) => {
  // console.log("create event request",req.body);
  try {

    const {
      serviceArray,
      amount,
      note,
      payment,
      offers,
      serviceId,
      serviceDate,
      customerId,
      status
    } = req.body;
    const newEvent = {
      customerId,
      amount,
      note,
      payment,
      offers,
      serviceDate,
      serviceId,
      status
    };
    console.log(newEvent);
    await Events.create(newEvent).then(
      async (eventRequestService) => {
        await Promise.all(
          serviceArray.map(async (service) => {
            const key = Object.keys(service)[0];
            const value = service[key];
            console.log(key, service);
            const newEventService = {
              eventId: eventRequestService.id,
              serviceInputFieldId: key,
              value: value,
            };

            await EventServices.create(
              newEventService
            );
          })
        );
      }
    );

    res.json("ok");
    // console.log("request entered",data.id)
  } catch (error) {
    console.log(error);
    throw new Error(error || "can't create Customer Request");
  }
});

exports.getAllEventRequests = asyncHandler(async (req, res) => {
  console.log("get all event requests");
  const page = parseInt(req.query.page);
  const status = req.query.status;
  const limit =parseInt(req.query.limit)
  // const {status,active,limit}=req.body
  // const page = active;
  let offset = limit * (page - 1)

  console.log(page,limit,status);
  try {
    const events = await Events.findAndCountAll({where:{status:status},
      include: [
        {
          model: EventServices,
        },
        {
          model: Customer,
        },
        {
          model: Services,
        },
      ],  
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });
    console.log(events);
    console.log("data");
    res.json(events);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get CustomerRequest");
  }
});

exports.getEventRequest = asyncHandler(async (req, res) => {
  console.log("get  event request");
  const id = req.params.id;
  try {
    const eventRequests = await Events.findOne({
      where: { id: id },
      include: [
        {
          model: EventServices,
          as: "eventServices",
          include:[{
            model:ServiceInputFields ,
        }]
        },
        {
          model: Customer,
        },
        {
          model: Services,
        },
      ],
    });
    console.log(eventRequests);
    console.log("data",eventRequests);
    res.json(eventRequests);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get EventRequest");
  }
});






// exports.createEventRequest = asyncHandler(async (req) => {
//   console.log("create event request");
//   try {
//     const { customerId, services, note,customerRequestId } = req.body;
//     const eventRequest = {
//       customerId,
//       note,
      
//     };
//     console.log(eventRequest,customerRequestId);
//     await EventRequests.create(eventRequest).then(async (eventRequest) => {
//       await Promise.all(
//         services.map(async (requestService) => {
//           const {
//             serviceArray,
//             amount,
//             note,
//             payment,
//             offers,
//             serviceId,
//             serviceDate,
//           } = requestService;

//           const newRequestService = {
//             eventRequestId: eventRequest.id,
//             amount,
//             note,
//             payment,
//             offers,
//             serviceDate,
//             serviceId,
//           };
//           await EventRequestServices.create(newRequestService).then(
//             async (eventRequestService) => {
//               await Promise.all(
//                 serviceArray.map(async (service) => {
//                   const key = Object.keys(service)[0];
//                   const value = service[key];
//                   console.log(key, service);
//                   const newRequestServiceService = {
//                     eventRequestServiceId: eventRequestService.id,
//                     serviceInputFieldId: key,
//                     value: value,
//                   };

//                   await EventRequestServicesServices.create(
//                     newRequestServiceService
//                   );
//                 })
//               );
//             }
//           );
//         })
//       );
//     });
//     await CustomerRequests.update({ status: "confirmed" }, {
//         where: { id: customerRequestId },
//         returning: true,
//     })
//     res.json("ok");
//     // console.log("request entered",data.id)
//   } catch (error) {
//     throw new Error(error || "can't create Customer Request");
//   }
// });