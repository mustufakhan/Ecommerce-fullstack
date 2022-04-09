const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controller/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middleware/auth');

router.route('/products').get(isAuthenticatedUser,authorizedRoles("admin"), getAllProducts);
router.route('/product/new').post(isAuthenticatedUser, createProduct);
router.route('/product/:id').put(isAuthenticatedUser, updateProduct);
router.route('/product/:id').delete(isAuthenticatedUser,deleteProduct);
router.route('/product/:id').get(getProductDetails);


module.exports = router;