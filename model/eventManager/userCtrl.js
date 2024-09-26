const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../../config/db.config");
const Employee = db.employees;
require('dotenv').config();

// Sign up user
const signUpUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).send({ message: "Please fill out all the fields!" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json("Enter valid email");
    }

    if (password.length < 8) {
      return res.status(401).send({ message: "Password should be at least 8 characters long!" });
    }

    const existingUser = await Employee.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json("User already exists with this email");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Employee.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(401).send({ message: "User not successfully created!" });
    }

    return res.status(200).json({
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Sign in user
const signInUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    //  const project = await Project.findOne({ where: { title: 'My Title' } });
    const user = await Employee.findOne({ where: { empEmail : email } });
    console.log("user.empPassword" ,user.empPassword);
    
    
    if (!user) {
      return res.status(401).json({ message: "User not found..Please sign up and log in!" });
    }
    // console.log(process.env.JWT_SECRET)
    // let isMatched = false;
    const isMatched = await bcrypt.compare(password, user.empPassword);
    if( password == user.empPassword ) isMatched = true
    
    console.log("is match" ,isMatched);


    if (!isMatched) {
      return res.status(401).json({ message: "Incorrect username or password!" });
    }
    // if (isMatched != true) {
    //   return res.status(401).json({ message: "Incorrect username or password!" });
    // }
    // const token = generateActivationToken(user.id);

    // return res.status(200).json({ token, ...user.toJSON() });
    return res.status(200).json({ user });
    // res.status(400).json({ user : user });
  } catch (error) {
    return res.status(400).json({ message: "User not found..Please sign up and log in!" });
  }
});

const isTokenAlive = asyncHandler(async (req, res) => {
  try {
    const token = req.header("x-auth-token");

    if (!token || token === "") {
      return res.status(401).json({ message: "Log in again!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_ACTIVATION_KEY, async (error, decodedUser) => {
      if (error) {
        return res.status(401).json({ message: error.message });
      }

      if (!decodedUser) {
        return res.status(401).json({ message: "Session Expired. Log in again!" });
      }

      const user = await User.findByPk(decodedUser.id);

      if (!user) {
        return res.status(401).json({ message: "Invalid login..Please log in again!" });
      }

      return res.status(200).json({ token, ...user.toJSON() });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const generateActivationToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_ACTIVATION_KEY, {
    expiresIn: "3m",
  });
};

module.exports = {
  signUpUser,
  signInUser,
  isTokenAlive,
};
