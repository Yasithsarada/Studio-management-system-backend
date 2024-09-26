const asyncHandler = require("express-async-handler")
const db = require("../../../config/db.config");
const { Op } = require("sequelize");
const Customer = db.customers;
const Event = db.events;
const Services=db.services

exports.createCustomers = asyncHandler(async (req, res) => {
console.log("hello");
    const { firstname, lastname, email, address, mobilePhone, status } = req.body
    if (mobilePhone) {
          
        const oldCustomer = await Customer.findOne({ where: { mobilePhone: mobilePhone } })
        
        if (oldCustomer) {
            console.log(oldCustomer);
            res.status(409).send({ message: "Customer already exist" });
            return
        }
        console.log(oldCustomer,"hello");
    }
    else {
        res.status(400).send({ message: "Customer required mobilephone" });
        return
    }
    console.log("middle");
    try {
        const customer = {
            firstname, lastname, email, address, mobilePhone,
            status:0
        };
        console.log(customer);
        const data = await Customer.create(customer)
        console.log("data",data);
        res.status(201).json(data);

    } catch (error) {
        console.log("eror",error)
        res.status(500);

        throw new Error(error.message || "Some error occurred while creating the Customer");
    }
})


exports.deleteCustomer = asyncHandler(async (req, res) => {

    const id = req.params.id
    if (!id) {
        res.status(400).send({ message: "can't remove ,invalid customer" });
        return
    }
    try {

        const data = await Customer.destroy({
            where: { id: id },
            returning: true
        })
        res.status(200).json(data);

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't remove Customer");
    }


})


exports.updateCustomer = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id, req.body,"update customer")
    try {

        const data = await Customer.update(req.body, {
            where: { id: id },
            returning: true,
        })
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message || "can't update Customer");
    }
})
exports.getCustomers = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const mobilePhone = req.query.mobilePhone;
    const limit = 8;
    console.log("get Customer",page,mobilePhone,limit);
    let offset = limit * (page - 1)
    try {
        if(mobilePhone){
            const data = await Customer.findAndCountAll({
                where: {
                    mobilePhone: { 
                      [Op.like]: `%${mobilePhone}%`
                    }
                  },
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        else{
            const data = await Customer.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            }) 
            console.log(data);
            res.status(200).json(data)
        }
        
       

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't get Customer");
    }
})


exports.getSearchCustomer=asyncHandler(async(req,res)=>{
    console.log("serch customer")
    const query=req.query.search;
    try {
        const data =await Customer.findOne({
                where: {
                    [Op.or]: [
                        { mobilePhone: { 
                            [Op.like]: `%${query}%`
                          }},
                        { email: { 
                            [Op.like]: `%${query}%`
                          } },
                      ] 
                },
                
          })
          res.status(200).json(data)  
    } catch (error) {
        res.status(400)
    throw new Error(error.message || "can't find Customer") 
    }

}
)

exports.getSearchCustomerEvents=asyncHandler(async(req,res)=>{
    console.log("serch customer events")
    const mobilePhone = req.params.mobilePhone;
    try {
        const data = await Event.findAll({
            include: [
              {
                model: Customer,
                attributes: ['id','firstname', 'lastname','mobilePhone'],
                where: {mobilePhone: mobilePhone }
              },
              {
                model: Services,
              }
            ],
            order: [['createdAt', 'DESC']]
          })
          console.log("data",data)
          res.status(200).json(data)  
    } catch (error) {
        res.status(400)
    throw new Error(error.message || "can't find Customer") 
    }

}
)

// exports.getSearchCustomerEvents=asyncHandler(async(req,res)=>{
//     console.log("serch customer events")
//     const mobilePhone = req.params.mobilePhone;
//     try {
//         // const data =await Event.findOne({
//         //         where: {
//         //             [Op.or]: [
//         //                 { mobilePhone: query },
//         //                 { email: query },
//         //               ] 
//         //         }
//         //   })
//           const data = await Event.findOne({
//             attributes: ['id','serviceType','date'],
//             include: [
//               {
//                 model: Customer,
//                 attributes: ['id','firstname', 'lastname'],
//                 where: {mobilePhone: mobilePhone }
//               }
//             ]
//           })
//           res.status(200).json(data)  
//     } catch (error) {
//         res.status(400)
//     throw new Error(error.message || "can't find Customer") 
//     }

// }
// )