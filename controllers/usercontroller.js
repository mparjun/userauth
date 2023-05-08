const User = require("../models/usermodel");
const AppError = require("../utils/apperror");
const catchAsync = require("../utils/catchasync");

exports.updateUser = catchAsync(async (req, res, next) => {
  const { email, number, aboutme, name } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }
  if (name) user.name = name;
  if (number) user.number = number;
  if (email) user.email = email;
  if (aboutme) user.aboutme = aboutme;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "data has been updated",
    data: {
      user,
    },
  });
});
