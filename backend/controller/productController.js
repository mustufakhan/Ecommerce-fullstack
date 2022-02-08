const Product = require('../model/productModel');

//CREATE PRODUCTS --ADMIN
exports.createProduct = async(req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  })
}

//GET ALL PRODUCTS
exports.getAllProducts = async(req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products
  })
}

// get product details
exports.getProductDetails = async(req, res, next) => {
  let product = await Product.findById(req.params.id);

  if(!product){
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
  }

  res.status(200).json({
    success: true,
    product
  })

}

//UPDATE PRODUCT --ADMIN 
exports.updateProduct = async(req, res) => {
  let product = await Product.findById(req.params.id);
  if(!product){
    return res.json({
      success: false,
      message: 'Product not found'
    })
  }
  console.log("--------",req.body)

  product = await Product.findByIdAndUpdate(req.params.id, req.body,{
    new: true,
    runValidator: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    product
  })
}

//delete product

exports.deleteProduct = async(req, res, next) => {
  const product = await Product.findById(req.params.id);

  if(!product){
    return res.status(500).json({
      success: false,
      message: "Product not found"
    })
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })
}