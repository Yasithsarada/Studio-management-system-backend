const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
// const Event = require("../../../model/eventManager/event.model");
const Event = db.events;

const { Op, Sequelize } = require("sequelize");
const Customer = db.customers;
const Employee = db.employees;

const EventServices = db.eventServices;

const Service = db.services;

const Department = db.departments;

exports.getEmployeesandSearch = asyncHandler(async (req, res) => {
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
                      model: Department,
                      attributes: ['id','departmentName'],
                    //   where: {empDepartment: id }
                    }
                  ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            })
            res.status(200).json(data)
        }
        else{
            const data = await Employee.findAndCountAll({
                include: [
                    {
                      model: Department,
                      attributes: ['id','departmentName'],
                    //   where: {empDepartment: id }
                    }
                  ],
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
});