const express = require('express');
const {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductDetails,
	createProductReview,
	getProductReviews,
	deleteReviews
} = require('../controller/productController');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

router.route('/products').get(getAllProducts);
router
	.route('/admin/product/new')
	.post(isAuthenticatedUser, authorizedRoles('admin'), isAuthenticatedUser, createProduct);
router
	.route('/admin/product/:id')
	.put(isAuthenticatedUser, authorizedRoles('admin'), isAuthenticatedUser, updateProduct);
router
	.route('/admin/product/:id')
	.delete(isAuthenticatedUser, authorizedRoles('admin'), isAuthenticatedUser, deleteProduct);
router.route('/product/:id').get(getProductDetails);
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/review').get(getProductReviews).delete(isAuthenticatedUser, deleteReviews);

module.exports = router;
