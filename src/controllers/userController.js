const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

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
