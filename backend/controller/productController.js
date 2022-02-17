const Product = require('../model/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures')

//CREATE PRODUCTS --ADMIN
exports.createProduct = catchAsyncError(async(req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  })
});

//GET ALL PRODUCTS
exports.getAllProducts = catchAsyncError(async(req, res) => {
  const apiFeature = await new ApiFeatures(Product.find(), req.query).search()
  // const products = await Product.find();
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products
  })
})

// get product details
exports.getProductDetails = catchAsyncError(async(req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product
  })

})

//UPDATE PRODUCT --ADMIN 
exports.updateProduct =catchAsyncError( async(req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
    runValidator: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  })
})

//delete product

exports.deleteProduct =catchAsyncError( async(req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })
})