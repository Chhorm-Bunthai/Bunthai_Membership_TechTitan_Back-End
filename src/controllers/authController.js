const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = async (user, statusCode, res, req) => {
  const token = signToken(user._id);
  user.password = undefined;
  if (token) {
    res.setHeader("Authorization", `Bearer ${token}`);
  }
  res.status(statusCode).json({
    status: "success",
    data: {
      token, // set it to frontend
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  const url = `${process.env.BASE_URL}/api/users/${newUser._id}/verify/${token}`;
  const message = "Please Click button Below ro verify your account";
  const notSeenEmail =
    "If you cannot verify this, please contact us: bunthaicambo89@gmail.com";
  try {
    await sendEmail({
      email: newUser.email,
      user: newUser.name,
      subject: "verify link",
      url,
      button: "Verify",
      message,
      notSeenEmail,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    await newUser.save({ validateBeforeSave: false }); // save all modified data
    // eslint-disable-next-line no-undef
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { verify: true },
    { new: true } // Returns the updated document
  );
  if (!updatedUser) {
    return next(new AppError("Internal Server Error", 500));
  }
  if (updatedUser) {
    res.redirect(`${process.env.CLIENT_URL}/verifyEmail`);
  }
  res.status(200).json({
    status: "success",
    message: "User's email verify successfully.",
    updatedUser,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if the users exist and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (!user.verify) {
    return next(new AppError("User is not verified yet!", 403));
  }
  // 3) If everythingok, send the token to the client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's exist
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

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restricTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission", 403));
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // deactivate all the validator in user the schema so that it's not gonna ask to confirm the password.

  const resetURL = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
  const message =
    "We're sending you this email because you requested a password reset. Click on this link to create a new password:";
  const notSeenEmail =
    "If you didn't get a password reset, you can ignore this email. Your password will not be changed.";
  try {
    await sendEmail({
      email: user.email,
      user: user.name,
      submit: "Your password reset token (valid for 10mins)",
      subject: "Reset password link",
      url: resetURL,
      button: "Reset Password",
      message,
      notSeenEmail,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!!!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); // save all modified data

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // the req.user.id comes through the protect route
  const user = await User.findById(req.user.id).select("+password");

  // passwordCurrent is the one that user input when enter this route and we compare it with the one in DB
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // dont use User.findByIdAndUpdate cuz it will not check for validate in userModel

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1,
    });

    res.status(200).json({
      status: "success",
      message: "Logged out",
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "failed to log out",
    });
  }
};
