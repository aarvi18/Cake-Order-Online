import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/errorHandler.js";
import Category from "../models/category.schema.js";

/******************************************************
 * @CREATE_CATEGORY
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/category/create/:adminId
 * @description Admin can create  Category
 * @parameters adminId, name
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns Category Object
 ******************************************************/
export const createCategory = asyncHandler(async (req, res) => {
  // Extact data from body
  const { name } = req.body;
  if (!name) throw new CustomError("Category name is required", 400);

  const existCategory = await Category.findOne({ name });
  if (existCategory) throw new CustomError("This category already exist");
  const date = {
    name,
    user: req.admin._id,
  };
  const category = await Category.create(date);

  res.status(200).json({
    success: true,
    category,
  });
});

/******************************************************
 * @UPDATE_CATEGORY
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/category/update/:adminId/:categoryId
 * @description Admin can update  Category
 * @parameters adminId, categoryId, name
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns Category Object
 ******************************************************/
export const updateCategory = asyncHandler(async (req, res) => {
  // Extact data from body
  const { name } = req.body;
  if (!name) throw new CustomError("Category name is required", 400);
  const category = await Category.findByIdAndUpdate(
    req.category?._id,
    { name },
    {
      new: true,
    }
  );
  // console.log(category);
  res.status(200).json({
    success: true,
    category,
  });
});

/******************************************************
 * @GET_SINGLE_CATEGORY
 * @ROLE ADMIN || USER
 * @route http://localhost:8000/api/v1/category/get/:categoryId
 * @description Single Category
 * @parameters
 * @middleware
 * @returns Category Object
 ******************************************************/
export const getSingleCategory = asyncHandler(async (req, res) => {
  // Extact data from body
  const category = req.category;
  // console.log(category);
  res.status(200).json({
    success: true,
    category,
  });
});

/******************************************************
 * @GET_ALL_CATEGORY
 * @ROLE ADMIN || USER
 * @route http://localhost:8000/api/v1/category/get
 * @description All Categories
 * @parameters
 * @middleware
 * @returns Category Array
 ******************************************************/
export const getAllCategory = asyncHandler(async (req, res) => {
  // Extact data from body
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});

/******************************************************
 * @REMOVE_CATEGORY
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/category/remove/:adminId/:categoryId
 * @description Remove Category
 * @parameters
 * @middleware
 * @returns
 ******************************************************/
export const removeCategory = asyncHandler(async (req, res) => {
  // Extact data from body
  const category = req.category;

  await category.remove();

  res.status(200).json({
    success: true,
    message: `Category removed successfully`,
  });
});
