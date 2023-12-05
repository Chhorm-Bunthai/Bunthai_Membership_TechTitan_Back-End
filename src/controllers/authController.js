const User = require('../models/userModel')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.signup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        paspasswordConfirm: req.body.paspasswordConfirm
    })
    res.status(201).json({
        status: "success",
        token,
        data: {
          user: newUser,
        },
      });
    
})
