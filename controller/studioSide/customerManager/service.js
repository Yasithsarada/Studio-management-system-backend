const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const { Sequelize } = require("sequelize");
const Services = db.services;
const ServiceInputFields = db.serviceInputFields;
const ServiceInputFieldValues = db.serviceInputFieldValues;

exports.createService = asyncHandler(async (req, res) => {
  //const t = await db.sequelize.transaction();
  console.log(req.body);
  const {
    serviceName,
    description,
    inputFields,
    selectFields,
    price,
    parentService,
  } = req.body;

  try {
    const service = {
      serviceName,
      description,
      price,
      parentService,
    };
    console.log("service : ", service);
    Services.create(service).then((service) => {
      console.log("database service", service);

      // for inputfeilds
      inputFields.forEach((element) => {
        const serviceinputfield = {
          fieldName: element,
          serviceId: service.id,
          type: "input",
        };
        console.log("service input field : ", serviceinputfield);
        ServiceInputFields.create(serviceinputfield).then(
          (serviceinputfield) => {
            console.log("database service input field", serviceinputfield);
          }
        );
      });

      // for selectfields
      selectFields.forEach((element) => {
        const key = Object.keys(element)[0];
        const objects = element[key];
        console.log(element, key, objects);
        const serviceinputfield = {
          fieldName: key,
          serviceId: service.id,
          type: "select",
        };
        console.log("service input field : ", serviceinputfield);
        ServiceInputFields.create(serviceinputfield).then(
          (serviceinputfield) => {
            console.log("database service input field", serviceinputfield);
            objects.forEach((element) => {
              const serviceinputfieldvalue = {
                fieldValueName: element.name,
                serviceInputFieldId: serviceinputfield.id,
                price: element.value,
              };
              ServiceInputFieldValues.create(serviceinputfieldvalue).then(
                (serviceinputfieldvalue) => {
                  console.log(
                    "serviceinputfieldvalue :",
                    serviceinputfieldvalue
                  );
                }
              );
            });
          }
        );
      });
    });
    // await t.commit();
    res.status(200).json("ok");
  } catch (error) {
    // await t.rollback();
    res.status(400);
    throw new Error(
      error.message || "Some error occurred while creating the Customer"
    );
  }
});

exports.getServices = asyncHandler(async (req, res) => {
  try {
    let customerServicelist = [];
    let customerServicelistfinal = [];
    const data = await Services.findAll({
      attributes: [
        [Sequelize.literal("id"), "value"],
        [Sequelize.literal("serviceName"), "label"],
        "parentService",
      ],
    });
    // console.log(data);
    data.forEach((i) => {
      i.dataValues.children = [];
      //console.log("i----------",i.dataValues);
      data.forEach((j) => {
        if (i.dataValues.value == j.dataValues.parentService) {
          // console.log(i.dataValues.serviceName,"parent of",j.dataValues.dataValues);
          i.dataValues.children.push(j.dataValues);
        }
      });

      customerServicelist.push(i.dataValues);
      //console.log("--------------------------------------------",i.dataValues);
    });

    customerServicelist.forEach((element) => {
      // console.log(element);
      if (!element.parentService) {
        customerServicelistfinal.push(element);
      }
    });
    //console.log(customerServicelist,"ff");
    res.status(200).json(customerServicelistfinal);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});

exports.getService = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;
  try {
    // const data = await Services.findOne({ where: { id: serviceId } });
    const service = await Services.findOne({
      where: { id: serviceId },
      include: [
        {
          model: ServiceInputFields,
          as: "serviceInputFields",
          include: [
            {
              model: ServiceInputFieldValues,
              as: "serviceInputFieldValues",
            },
          ],
        },
      ],
    });
    console.log(service);
    // const {
    //   id,
    //   serviceName,
    //   description,
    //   inputFields,
    //   selectFields,
    //   parentService,
    //   price,
    // } = data;
    res.status(200).json(service);
    // res.status(200).json({
    //   id,
    //   serviceName,
    //   description,
    //   inputFields: JSON.parse(inputFields),
    //   selectFields: JSON.parse(selectFields),
    //   parentService,
    //   price,
    // });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});

// exports.updateService = asyncHandler(async (req, res) => {
//   try {
//     const serviceId = req.params.id;
//     console.log(serviceId);
//     const service = await Services.findOne({
//       where: { id: serviceId },
//       include: [
//         {
//           model: ServiceInputFields,
//           as: "serviceInputFields",
//           include: [
//             {
//               model: ServiceInputFieldValues,
//               as: "serviceInputFieldValues",
//             },
//           ],
//         },
//       ],
//     });
//     console.log("in service edit", service);
//     if (service) {
//       const {
//         serviceName,
//         description,
//         inputFields,
//         selectFields,
//         price,
//         parentService,
//       } = req.body;

//       const customerService = {
//         serviceName,
//         description,
//         price,
//         // parentService,
//       };
//       const data = await Services.update(customerService, {
//         where: { id: serviceId },
//         returning: true,
//       });

//       const existingFields = service.serviceInputFields.map(field => field.fieldName);
//       const fieldsToAdd = inputFields.filter(field => !existingFields.includes(field));
//       const fieldsToRemove = service.serviceInputFields.filter(field => !inputFields.includes(field.fieldName));

//       // Add new fields to the database
//       for (const field of fieldsToAdd) {
//         await ServiceInputFields.create({
//           fieldName: field,
//           serviceId: serviceId,
//           type: 'input' // or 'select' based on your logic
//         });
//       }

//       // Remove old fields from the database
//       for (const field of fieldsToRemove) {
//         await ServiceInputFields.destroy({
//           where: { id: field.id }
//         });
//       }

//       console.log(data,"edited service table");
//     }

//     res.status(200).json({ serviceId });
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message || "can't get Customer");
//   }
// });

exports.updateService = asyncHandler(async (req, res) => {
  try {
    const serviceId = req.params.id;

    const { serviceName,
      description,
      price,
      parentService, } = req.body;
    console.log(serviceId);

    const customerService = {
      serviceName,
      description,
      price,
      parentService,
    };
    const data = await Services.update(customerService, {
      where: { id: serviceId },
      returning: true,
    });

    if (data) {
      res.status(200).json({ serviceId });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});

exports.updateServiceInput = asyncHandler(async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { inputfieldList } = req.body;
    console.log(inputfieldList, serviceId);

    const promises = inputfieldList.map((element) => {
      console.log(element);
      return ServiceInputFields.create({
        serviceId: serviceId,
        type: "input",
        fieldName: element,
      });
    });

    await Promise.all(promises).then((data)=>{
      res.status(200).json({ serviceId });
    });

  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});

exports.updateServiceOptions = asyncHandler(async (req, res) => {
  try {
    const selectId = req.params.id;
    const { selectoptionList } = req.body;
    console.log(selectoptionList, selectId);

    const promises = selectoptionList.map((element) => {
      console.log(element);
      return ServiceInputFieldValues.create({
        serviceInputFieldId: selectId,
        fieldValueName: element,
      });
    });

    await Promise.all(promises).then((data)=>{
      res.status(200).json({ selectId });
    });

  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});


exports.updateServiceSelect = asyncHandler(async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { newselectfields } = req.body;
    console.log(newselectfields, serviceId);

  newselectfields.map((element) => {
      // console.log(element);
        const key = Object.keys(element)[0];
        const objects = element[key];
        console.log(key,objects);
       ServiceInputFields.create({
        serviceId: serviceId,
        type: "select",
        fieldName: key,
      }).then((data)=>{
        objects.map((element) => {
          ServiceInputFieldValues.create({
            serviceInputFieldId: data.id,
            fieldValueName: element.name,
          });
        })
      });
    });

    res.status(200).json("ok");
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});


exports.deleteService = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;
  console.log(serviceId);
  try {
    const data = await Services.destroy({
      where: { id: serviceId },
      returning: true,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});

// Adjust the path to your db.config file
