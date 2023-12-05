// Import required modules
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Destructure mongoose to get Schema and model
const { Schema, model } = mongoose;

// Define the user schema
const userSchema = new Schema({
  // User's name
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  // User's email
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    // Validate email format using the validator library
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  // User's password
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    // Do not include the password in query results
    select: false,
  },
  // Confirm the user's password
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
  // User's role with predefined values (user, seller, admin)
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  // User's photo (optional)
  photo: String,
  // Flag indicating whether the user is active or not
  active: {
    type: Boolean,
    default: true,
    // Do not include the active status in query results
    select: false,
  },
  // Timestamp for when the user's password was last changed
  passwordChangedAt: Date,
  // Token for password reset
  passwordResetToken: String,
  // Expiration date for the password reset token
  passwordResetExpires: Date,
});

// Create and export the User model based on the user schema
module.exports = model("User", userSchema);
