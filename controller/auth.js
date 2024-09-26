const express = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../config/db.config');
const Admin = db.admin;
const Employees = db.employees;
const Privilege = db.privileges;
const { validationResult } = require('express-validator');

// @route    get admin/auth
// @desc     load user relevent to token
exports.getCurruntAdmin = asyncHandler(async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // console.log(req.admin);
    const data = await Employees.findAll({
      where: {
        id: req.admin.id,
      },
      include: [
        {
          model: Privilege,
          as: 'Privileges',
        },
      ],
    });

    if (!data[0]) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // console.log(data[0]);

    // Extract privileges into an array
    const privilegesArray = data[0].Privileges.map(
      (privilege) => privilege.privilege
    );

    // console.log(privilegesObject);
    console.log(data[0]);

    const updateData = {
      id: data[0].id,
      empName: data[0].empName,
      empAdd: data[0].empAdd,
      empType: data[0].empType,
      empDepartment: data[0].empDepartment,
      empNumber: data[0].empNumber,
      empEmail: data[0].empEmail,
      privileges: privilegesArray,
    };
    // console.log(updatedData);
    // console.log(transformedObject);

    // data=array.split('')

    // console.log('+++++++++++++++++++++++++',data);
    res.status(200).json(updateData);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't load Admin");
  }
});

// @route    POST admin/auth
// @desc     Authenticate user & get token

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  // console.log('++++++++++++++++++++++++++++++++',email,password);
  // Check if admin exists

  const employee = await Employees.findOne({ where: { empEmail: email } });

  // console.log('++++++++++++++++++++++++++++',employee);
  const admin = await Admin.findOne({ where: { empId: employee.id } });
  // console.log('++++++++++++++++++++++++++++', admin);
  const privileges = await Privilege.findAll({ where: { empId: employee.id } });
  const privilegeArray = privileges.map((priv) => priv.privilege);
  // console.log(privilegeArray);

  if (!employee) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  if (!admin) {
    return res.status(400).json({ message: 'Access denied' });
  }
  if (!privilegeArray) {
    return res.status(400).json({ message: 'admin not have privilege' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  // Create JWT token
  const payload = {
    admin: {
      id: admin.empId,
      privileges: privilegeArray,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '5 days' },
    // { expiresIn: '3m' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});
