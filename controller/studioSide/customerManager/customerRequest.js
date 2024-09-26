const asyncHandler = require("express-async-handler")
const db = require("../../../config/db.config");
const { Op } = require("sequelize");
const CustomerRequests = db.customerRequests;

exports.createCustomerRequest=asyncHandler(async(req)=>{
console.log("create customer request")
try {
const {firstname, lastname, email, address, mobilePhone,serviceType,serviceDate,note,status}=req
    const customerRequest = {
        firstname, lastname, email, address, mobilePhone,serviceType,serviceDate,note,status
        
    };
    console.log(customerRequest);
    const data = await CustomerRequests.create(customerRequest)
    console.log("request entered",data)

} catch (error) {

    throw new Error(error || "can't create Customer Request");
}

})

exports.getAllCustomerRequests = asyncHandler(async (req,res) => {
    console.log("get all customer requests");
    const {status,active,limit}=req.body
    const page = active;
    let offset = limit * (page - 1)
  
    console.log(page,req.body);
    try {
        const data = await CustomerRequests.findAndCountAll({
            limit: limit,
            offset: offset,
            where:{status:status},
            order: [['createdAt', 'DESC']],
        })
     console.log("data")
     res.json(data)
    } catch (error) {
        res.status(400)
        // throw new Error(error.message || "can't get CustomerRequest");
    }
})

exports.updateCustomerRequest = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id, req.body,"update customer")
    const {status}=req.body
    try {

        const data = await CustomerRequests.update({status:status}, {
            where: { id: id },
            returning: true,
        })
        res.status(200).json(data)
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "can't update Customer");
    }
})

exports.createCustomerRequestOnline=async(req)=>{
    console.log("create customer request")
    try {
    const {firstname, lastname, email, address, mobilePhone,serviceType,serviceDate,note,status}=req
        const customerRequest = {
            firstname, lastname, email, address, mobilePhone,serviceType,serviceDate,note,status
            
        };
        console.log(customerRequest);
        const data = await CustomerRequests.create(customerRequest)
        console.log("request entered",data)
        return data
    } catch (error) {
    
        throw new Error(error || "can't create Customer Request");
    }
}