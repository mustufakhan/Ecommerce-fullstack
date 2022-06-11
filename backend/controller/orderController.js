const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

//create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
	const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt } = req.body;

	const order = await Order.create({
		shippingInfo,
		orderItems,
		paymentInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paidAt,
		user: req.user._id,
	});

	res.status(201).json({
		success: true,
		order
	})
});

//get single order 
exports.getSingleOrder = catchAsyncError(async(req,res, next)=>{
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	);

	if(!order){
		return next(new ErrorHandler('Order not found with id', 404));
	}

	res.status(200).json({
		success: true,
		order
	})
})

//get logged in user orders
exports.getMyOrder = catchAsyncError(async(req,res, next)=>{
	const order = await Order.find({user: req.user._id})

	res.status(200).json({
		success: true,
		order
	})
})

//get all orders -admin
exports.getAllOrder = catchAsyncError(async(req,res, next)=>{
	const orders = await Order.find();
	let totalAmount = 0;

	orders.forEach((order)=>{
		console.log(order)
		totalAmount += order?.totalPrice;
	})

	res.status(200).json({
		success: true,
		orders,
		totalAmount
	})
})

// update Order Status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}


// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
	console.log(order)
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});