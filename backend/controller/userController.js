const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendToken = require('../utils/JWTToken');
const sendMail = require('../utils/sendMail');

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

exports.forgotPassword = catchAsyncError(async(req, res, next)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return next(new ErrorHandler('User not found', 404))
  }

  const resetToken = await user.getResetPasswordToken();
  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${req.protocal}://${req.get('host')}/api/v1/reset/password/${resetToken}`;
  const message = `Your password reset token is ${resetPasswordUrl} \n\n  If you have not requested, ignore this mail`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Ecommerce password recovery',
      message
    })

    res.status(200).json({
      success:true,
      message: `Email sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500))
  }
})