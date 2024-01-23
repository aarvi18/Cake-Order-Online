import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/errorHandler.js";
import Product from "../models/product.schema.js";
import Order from "../models/order.schema.js";

export const checkOrderField = asyncHandler(async (req, _res, next) => {
  console.log(req.body);
  const { shippingInfo, orderItems, totalAmount } = req.body;
  if (!(shippingInfo && orderItems && totalAmount))
    throw new CustomError("All fields are required");

  const { address, city, phoneNo, postalCode, state } = shippingInfo;
  if (!(address && city && phoneNo && postalCode && state))
    throw new CustomError("All fields are required");

  next();
});

export const isValidateProducts = asyncHandler(async (req, _res, next) => {
  const { orderItems } = req.body;
  for (const value of orderItems) {
    const product = await Product.findById(value.productId);
    if (!product) throw new CustomError("Product not found");
  }
  next();
});

export const amoutChecker = asyncHandler(async (req, _res, next) => {
  const { orderItems, totalAmount } = req.body;
  let amount = 0;

  //   iterat all product
  for (const value of orderItems) {
    const product = await Product.findById(value.productId);
    if (value.price !== product.price)
      throw new CustomError("Product price has been change", 400);
    amount += product.price * value.quantity;
  }
  if (amount !== totalAmount)
    throw new CustomError("Wrong amout provided", 400);

  next();
});

export const isProductAvailable = asyncHandler(async (req, _res, next) => {
  const { orderItems } = req.body;

  //   iterat all product
  for (const value of orderItems) {
    const product = await Product.findById(value.productId);
    if (!(value.quantity <= product.stock))
      throw new CustomError("Product not available", 400);
  }

  next();
});

export const findOrderById = async (req, res, next, id) => {
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(400).json({ error: "Invalid OrderId" });
    req.order = order;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid OrderId" });
  }
};
