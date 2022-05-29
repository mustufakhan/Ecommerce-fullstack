const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails,updatePassword, updateProfile,getAllUsers, getSingleUserDetails, updateUserProfile, deleteUser } = require('../controller/userController');
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
router.route('/admin/user/:id').get(isAuthenticatedUser, getSingleUserDetails).put(isAuthenticatedUser, authorizedRoles('admin'), updateUserProfile).delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);

module.exports = router;