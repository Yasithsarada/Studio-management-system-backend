const asyncHandler = require('express-async-handler');
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const nodemailer = require('nodemailer');
// const {
//   FORGOT_PASSWORD_MODEL,
//   RESET_PASSWORD_MODEL,
// } = require('../utility/joi');
// const AppError = require('../utils/error');
const { check, validationResult } = require('express-validator');
const { where } = require('sequelize');

// const User = db.user;
const Admin = db.admin;
const Employee = db.employees;
const User = db.users;

// Forgot Password
exports.user_forgotPassword = asyncHandler(async (req, res, next) => {

  const { email } = req.body;
  const employee = await Employee.findOne({ where: { empEmail:email } });
  if (!employee) {
    // return next(new AppError('User not found', 400));
    return res
      .status(400)
      .send({ message: 'No employee found with this email' });
  }

  const empId=employee.id;
  // console.log('===============================',employee.id);
  // console.log('===============================',empId);

  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpire = new Date();
  otpExpire.setMinutes(otpExpire.getMinutes() + 100);

   const [user, created] = await User.findOrCreate({
     where: { empId },
     defaults: {
       empId,
       otp,
       otpExpire,
     },
   });

      // console.log(user);
      // console.log(created);

  if (!created) {
    // If the user already exists, update the OTP and otpExpire
    const existuser = await user.update({
      otp,
      otpExpire,
    });
    // console.log(existuser);
  }

   
  //  console.log(created);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'anonymousshield014@gmail.com',
      pass: 'ugqa dhrk zyze rneq',
    },
  });

  const mailOptions = {
    from: 'anonymousshield014@gmail.com',
    to: email,
    subject: 'Password reset OTP',
    text: `Your OTP (It is expired after 1 min) : ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // return next(new AppError(error.message, 500));
      res
        .status(400)
        .send({ error });
    } else {
      res.json({ data: 'Your OTP has been sent to the email' });
    }
  });
});

// Reset Password
exports.user_resetPassword = asyncHandler(async (req, res, next) => {
  const { password, otp } = req.body;
  // if (isEmpty(req.body)) return next(new AppError('Form data not found', 400));

  // const { error } = RESET_PASSWORD_MODEL.validate(req.body);
  // if (error) return next(new AppError(error.details[0].message, 400));

  // if (password !== confirmPassword) {
  //   return res.status(400).send({ message: 'Passwords does not match' });
  // }

  const currentTime = new Date();
  // console.log('Current Time:', currentTime);
  // console.log('OTP:', otp);

  const user = await User.findOne({
    where: { otp, otpExpire: { [db.Sequelize.Op.gt]: new Date() } },
  });
  // console.log(user);
  if (!user) return res.status(400).send({ message: 'Invalid or expired OTP' });
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Start a transaction
    await db.sequelize.transaction(async (transaction) => {
    const updatedRows = await User.findOne(
      { where: { otp } },
      { transaction }
    );
    // const [updatedRows] = await User.update(
    //   { otp: null, otpExpire: null },
    //   { where: { otp } },
    //   // { transaction }
    // );

    console.log('got user', updatedRows);

    if (updatedRows === 0) {
      return res.status(400).send({ message: 'failed to update password' });
    }
    console.log('after check exists');



    empId = updatedRows.empId;
    if (!empId || !password) {
      return res.status(400).send({ message: 'failed to update password' });
    }
    console.log('after check coorect data to update');

    console.log('data to update', empId, hashedPassword);

    const admin = await Admin.update(
      { password: hashedPassword },
      { where: {empId} },
      { transaction }
    );

    console.log(admin);

    res.json({ data: 'Password reset successful' });
    })
  } catch (error) {
    return res.status(500).send({ message: 'Error occured while updating password',error });
  }
});