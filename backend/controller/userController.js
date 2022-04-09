const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendToken = require('../utils/JWTToken')

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

  sendToken(user, 201, res);
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

  sendToken(user, 200, res);  
});

exports.logout = catchAsyncError( async(req, res, next)=>{
  res.cookie("token", null,{
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Logged Out"
  })
})