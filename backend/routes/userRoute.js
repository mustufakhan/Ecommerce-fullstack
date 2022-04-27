const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword } = require('../controller/userController');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/reset/password/:token").put(resetPassword);

module.exports = router;