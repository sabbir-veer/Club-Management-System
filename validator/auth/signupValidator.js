const { body } = require("express-validator");
const User = require('../../models/User')
module.exports = [
  body("username")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username must be between 2 to 15 characters")
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username already used");
      }
    })
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email already used");
      }
    })
    .normalizeEmail(),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be greater than 5 characters"),
  body("confirmPassword")
    .isLength({ min: 5 })
    .withMessage("Password must be greater than 5 characters")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword != req.body.confirmPassword) {
        throw new Error("Password does not match");
      }
      return true;
    }),
];
