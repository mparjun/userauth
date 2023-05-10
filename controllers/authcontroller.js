const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const AppError = require("../utils/apperror");
const catchAsync = require("../utils/catchasync");

const signToken = (email, number, id) =>
  jwt.sign({ email, number, id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    number: req.body.number,
  });

  const token = signToken(newUser.email, newUser.number, newUser._id);
  console.log(token);
  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide email and password"), 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   const { email, oldPassword, newPassword } = req.body;

//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new AppError("no user found with this email", 401));
//   } else if (!(await user.correctPassword(oldPassword, user.password))) {
//     return next(new AppError("password is incorrect"));
//   } else {
//     const updatedUser = await User.findOneAndUpdate(
//       { email: email },
//       { password: newPassword }
//     );
//     res.status(200).json({
//       status: "success",
//       message: "password has been changed",
//       data: {
//         user: updatedUser,
//       },
//     });
//   }
// });
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, oldPassword, newPassword, passwordConfirm } = req.body;

  if (!passwordConfirm) {
    return next(new AppError("Please confirm your password", 400));
  }

  if (newPassword !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("no user found with this email", 401));
  } else if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError("password is incorrect"));
  } else {
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "password has been changed",
      data: {
        user,
      },
    });
  }
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  next();
});
