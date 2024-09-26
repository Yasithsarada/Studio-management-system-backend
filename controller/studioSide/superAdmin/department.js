const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const Departments = db.departments;
const Employees=db.employees

exports.createDepartment = asyncHandler(async (req, res) => {
  const {
    departmentName,
    departmentHeadId,
    departmentHeadName,
    description
  } = req.body;

  if (departmentName) {
    const oldDepartment = await Departments.findOne({
      where: { departmentName: departmentName },
    });
    if (oldDepartment) {
      console.log(oldDepartment);
      res.status(400).send({ message: "Department already exist" });
      return;
    }
  } else {
    res.status(400).send({ message: "Department required name" });
    return;
  }

  try {
    const department = {
      departmentName,
      departmentHeadId,
      departmentHeadName,
      description
    };
    console.log(department);
    const data = await Departments.create(department);
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(
      error.message || "Some error occurred while creating Department"
    );
  }
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "can't remove ,invalid Department" });
    return;
  }
  try {
    const data = await Departments.destroy({
      where: { id: id },
      returning: true,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't remove Admin");
  }
});

exports.updateDepartment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id, req.body);
  try {
    const data = await Departments.update(req.body, {
      where: { id: id },
      returning: true,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't update Department");
  }
});

exports.getDepartment = asyncHandler(async (req, res) => {

 
  try {
    const data = await Departments.findAndCountAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Departments");
  }
});

exports.getDepartmentByid = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  try {
    const data = await Departments.findOne({
      where: { id: id }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Departments");
  }
});
