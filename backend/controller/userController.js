const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "fake id",
      url: "fake url",
    },
  });

  const token = user.getJWTToken();

  res.status(201).json({ success: true, token });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { password, email } = req.body;

  if(!email || !password){
    return next(new ErrorHandler('please enter email and password', 400))
  }
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return next(new ErrorHandler('invalid credentials', 401))
  }

  const isPasswordMatched = await user.comparePassword(password);

  if(!isPasswordMatched){
    return next(new ErrorHandler('invalid credentials', 401))
  }

  const token = user.getJWTToken();

  res.status(200).json({ success: true, token });
});
