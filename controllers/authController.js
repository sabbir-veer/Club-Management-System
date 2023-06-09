const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator')

const User = require("../models/User");
const errorFormatter = require('../utils/validationErrorFormatter')

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", { tittle: "Create A New Account" , error: {}, value: {}});
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;

  let errors = validationResult(req).formatWith(errorFormatter)
  if(!errors.isEmpty()) {
    return res.render("pages/auth/signup", {
      tittle: "Create A New Account",
      error: errors.mapped(),
      value: {
        username, email, password
      }
    });
  }
  
  try {
    let hashedPassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });
    let createdUser = await user.save();
    console.log("User created successfully", createdUser);
    res.render("pages/auth/signup", { tittle: "Create A New Account" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  res.render("pages/auth/login", { tittle: "Login to your account", error: {}});
};

exports.loginPostController = async (req, res, next) => {
  let {email, password} = req.body

  let errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.render("pages/auth/login", {
      tittle: "Login to your account",
      error: errors.mapped(),
    });
  }

  try {
    let user = await User.findOne({email})
    if(!user) {
      return res.json({
        message: 'Invalid Credential'
      })
    }

    let match = await bcrypt.compare(password, user.password)
    if(!match) {
      return res.json({
        message: 'Invalid Credential'
      })
    }

    console.log('Successfully logged in', user);
    res.render("pages/auth/login", { tittle: "Login to your account" });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.logoutController = (req, res, next) => {};
