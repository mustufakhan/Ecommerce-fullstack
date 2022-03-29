const mongoose = require("mongoose");
const validtor = require('validator');

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

module.exports = mongoose.model('User', userSchema);