const express = require('express');
const {
  newOrder, getSingleOrder, getMyOrder, getAllOrder, updateOrder, deleteOrder
} = require('../controller/orderController');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, getMyOrder);
router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrder);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizedRoles('admin'), updateOrder).delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder);

module.exports = router;