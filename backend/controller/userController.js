const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendToken = require('../utils/JWTToken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');

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

  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/password/${resetToken}`;
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

exports.resetPassword = catchAsyncError(async(req, res, next)=>{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()},
  })
  
  if(!user){
    return next(new ErrorHandler('reset token is invalid or expired', 400))
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler('Password does not match', 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res);
})

//get User Details
 exports.getUserDetails = catchAsyncError(async (req, res, next)=>{
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  });
 });


 //change password
 exports.updatePassword = catchAsyncError(async(req, res, next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHandler('Old password is incorrect', 400));
  }

  if(req.body.confirmPassword !== req.body.newPassword){
    return next(new ErrorHandler('password does not matched', 400));
  }

  user.password = req.body.newPassword;
  user.save();

  sendToken(user, 200, res);
 })//get User Details
 exports.getUserDetails = catchAsyncError(async (req, res, next)=>{
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  });
 });


exports.updateProfile = catchAsyncError(async(req, res, next)=>{
  const newUserData = {
    name:req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true
  })
})


//get User Details(admin)
exports.getAllUsers = catchAsyncError(async (req, res, next)=>{
  const users = await User.find({});
  console.log({users})
  res.status(200).json({
    success: true,
    users
  });
 });


 //get Single User Details(admin)
 exports.getSingleUserDetails = catchAsyncError(async (req, res, next)=>{
  const user = await User.findById(req.user.id)

  if(!user){
    return next(new ErrorHandler('User does not exist with ID'+ req.user.id , 400));
  }
  res.status(200).json({
    success: true,
    user
  });
 });
