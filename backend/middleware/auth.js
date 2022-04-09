const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");

const isAuthenticatedUser = catchAsyncError(async(req, res,next)=>{
  const {token} = req.cookies;

  if (!token){
    return next(new ErrorHandler('Please login to access this resource', 401));
  };

  const decodedData = jwt.verify(token, process.env.JWT_TOKEN)
  req.user =  await User.findById(decodedData.id);
  next()
})


const authorizedRoles = (...roles) => {
  return(req,res, next) =>{
    if(!roles.includes(req.user.role)){
      return next(new ErrorHandler(`Role: ${req.user.role} is not allowed this resource`, 403)
      )}
    next()
  }
}

module.exports = {isAuthenticatedUser, authorizedRoles};