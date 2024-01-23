import express from "express";
const router = express.Router();

import {
  createProduct,
  getProduct,
  getProducts,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  findAdminById,
  isAdmin,
  isAuthenticateAdmin,
  isSignin,
} from "../middlewares/auth.middleware.js";
import { findProductById } from "../middlewares/product.middleware.js";

router.param("adminId", findAdminById);
router.param("productId", findProductById);

router.post(
  "/product/create/:adminId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  createProduct
);

router.put(
  "/product/update/:adminId/:productId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  updateProduct
);

router.get("/product/get", getProducts);
router.get("/product/get/:productId", getProduct);

router.delete(
  "/product/remove/:adminId/:productId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  removeProduct
);

export default router;
