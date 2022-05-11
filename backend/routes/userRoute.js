const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails,updatePassword, updateProfile,getAllUsers, getSingleUserDetails } = require('../controller/userController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/reset/password/:token").put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizedRoles('admin'),getSingleUserDetails);

module.exports = router;