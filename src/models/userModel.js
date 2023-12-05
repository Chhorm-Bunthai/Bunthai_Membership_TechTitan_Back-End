// Import required modules
const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcryptjs");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    // Validate email format using the validator library
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    // Do not include the password in query results
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter to confirm your password"],
    validate: {
      // Custom validator to check if passwordConfirm matches the password
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  photo: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
// Create and export the User model based on the user schema
module.exports = model("User", userSchema);
