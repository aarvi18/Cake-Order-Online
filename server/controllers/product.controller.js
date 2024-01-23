import cloudinary from "cloudinary";

import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/errorHandler.js";
import Product from "../models/product.schema.js";
import Category from "../models/category.schema.js";

/******************************************************
 * @CREATE_PRODUCT
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/product/create/:adminId
 * @description Admin can create Product
 * @parameters name, price, description, stock, category, photo
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns Product Object
 ******************************************************/
export const createProduct = asyncHandler(async (req, res) => {
  // Extract data from body
  const { name, price, description, stock, category } = req.body;
  if (!req.files?.photos) throw new CustomError("Images must be required", 400);
  // Extract data from files
  const { photos } = req.files;
  // Check if any fileds is missing or not
  if (!(name && price && description && stock && category))
    throw new CustomError("All fields are required", 400);

  // Minimum two images are required
  if (photos.length === undefined)
    throw new CustomError("Provite at least 2 images of the Product");

  const images = [];
  // Check eatch of the image size. And image size must be under 2 mb
  for (const file of photos) {
    if (!(file.size <= 2 * 1024 * 1024)) {
      throw new CustomError("File size must be at under 2 MB");
    }
  }

  // After upload images store the upload result inside the empty images array
  for (const file of photos) {
    let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "cack_order/products",
    });
    images.push({
      public_id: result.public_id,
      secure_url: result.secure_url,
      imageData: {
        imageType: file.mimetype,
        imageName: file.name,
        imageSize: file.size,
      },
    });
  }

  // Extract all data
  const data = {
    name,
    price,
    description,
    stock,
    category,
    user: req.auth._id,
    photos: images,
  };

  const product = await Product.create(data);

  await Category.findByIdAndUpdate(category, {
    $push: { products: product._id },
  });

  return res.status(200).json({
    success: true,
    product,
  });
});

/******************************************************
 * @UPDATE_PRODUCT
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/product/update/:adminId/:productId
 * @description Admin can Update Product
 * @parameters name, price, description, stock, category, photo
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns Product Object
 ******************************************************/
export const updateProduct = asyncHandler(async (req, res) => {
  // Extract data from body
  const { name, price, description, stock, category } = req.body;

  let product = req.product;
  let images = [];

  let data = {
    name,
    price,
    description,
    stock,
    category,
  };

  if (req.files) {
    const { photos } = req.files;
    // Check file size under 2 MB
    for (const file of photos) {
      if (!(file.size <= 2 * 1024 * 1024)) {
        throw new CustomError("File size must be at under 2 MB");
      }
    }

    for (const file of product.photos) {
      await cloudinary.v2.uploader.destroy(file.public_id);
    }

    // After upload images store the upload result inside the empty images array
    for (const file of photos) {
      let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "cack_order/products",
        use_filename: true,
        unique_filename: false,
      });
      images.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
        imageData: {
          imageType: file.mimetype,
          imageName: file.name,
          imageSize: file.size,
        },
      });
    }

    data.photos = images;
  }

  const updateProduct = await Product.findByIdAndUpdate(req.product._id, data, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    updateProduct,
  });
});

/******************************************************
 * @GET_ALL_PRODUCTS
 * @ROLE ADMIN || USER
 * @route http://localhost:8000/api/v1/product/get
 * @description Get all product
 * @parameters
 * @middleware
 * @returns Products Arrary
 ******************************************************/
export const getProducts = asyncHandler(async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  const searchObj = {};

  if (search) {
    searchObj.$or = [
      { name: new RegExp(search.trim(), "i") },
      { description: new RegExp(search.trim(), "i") },
    ];
  }

  if (maxPrice) {
    searchObj.price = { ...searchObj.price, $lte: maxPrice.trim() };
  }
  if (minPrice) {
    searchObj.price = { ...searchObj.price, $gte: minPrice.trim() };
  }

  const products = await Product.find(searchObj);

  return res.status(200).json({
    success: true,
    products,
  });
});

/******************************************************
 * @GET_ALL_PRODUCT
 * @ROLE ADMIN || USER
 * @route http://localhost:8000/api/v1/product/get/:productId
 * @description Get Single product
 * @parameters
 * @middleware
 * @returns Product Object
 ******************************************************/
export const getProduct = asyncHandler(async (req, res) => {
  const product = req.product;
  return res.status(200).json({
    success: true,
    product,
  });
});

/******************************************************
 * @REMOVE_PRODUCT
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/product/remove/:adminId/:productId
 * @description Admin can Update Product
 * @parameters
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns
 ******************************************************/
export const removeProduct = asyncHandler(async (req, res) => {
  const product = req.product;

  for (const file of product.photos) {
    await cloudinary.v2.uploader.destroy(file.public_id);
  }

  await product.remove();
  return res.status(200).json({
    success: true,
    message: "Product removed successfully",
  });
});
