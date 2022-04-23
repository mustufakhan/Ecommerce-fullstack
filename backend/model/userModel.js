const mongoose = require("mongoose");
const validtor = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please enter your name'],
    maxlength: [20, 'Name can not exceed 20 characters'],
    minlength: [4, 'Name should have more than 4 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validtor.isEmail, "PLease enter valid email"]
  },
  password: {
    type:String,
    required: [true, 'Please enter your password'],
    minlength: [4, 'Password should have more than 4 characters'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  this.password = await bcrypt.hash(this.password, 10)
})

//JWT token
 userSchema.methods.getJWTToken = function() {
   return  jwt.sign({ id: this._id }, process.env.JWT_TOKEN,{
     expiresIn: process.env.JWT_EXPIRE,
   });
 };

 //compare password
 userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
 }

// Reset password

userSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
  return resetToken; 
}

module.exports = mongoose.model('User', userSchema);