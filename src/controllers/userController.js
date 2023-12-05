const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users)
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    console.log("err");
  }
};
