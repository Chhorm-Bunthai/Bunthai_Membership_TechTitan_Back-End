const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // console.log(users)
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  res.status(200).json({
    message: "Success but this route is not implement yet",
  });
});

exports.queryMe = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not log in! Please log in!!!"));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token is no longer exist", 401)
    );
  }
  console.log(currentUser);
  res.status(200).json({
    status: "success",
    data: {
      me: currentUser,
    },
  });
});
