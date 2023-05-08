const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");
const AppError = require("../utils/apperror");
const catchAsync = require("../utils/catchasync");
const { encrypt, decrypt } = require("./encrypt");

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

exports.login = async (req, res, next) => {
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
};
