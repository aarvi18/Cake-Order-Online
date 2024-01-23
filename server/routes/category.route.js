import express from "express";
const router = express.Router();

import {
  createCategory,
  getAllCategory,
  getSingleCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controller.js";

import {
  findAdminById,
  isAdmin,
  isAuthenticateAdmin,
  isSignin,
} from "../middlewares/auth.middleware.js";
import { findCategoryById } from "../middlewares/category.middleware.js";

router.param("adminId", findAdminById);
router.param("categoryId", findCategoryById);

router.post(
  "/category/create/:adminId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  createCategory
);

router.put(
  "/category/update/:adminId/:categoryId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  updateCategory
);

router.get("/category/get/:categoryId", getSingleCategory);
router.get("/category/get", getAllCategory);

router.delete(
  "/category/remove/:adminId/:categoryId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  removeCategory
);

export default router;
