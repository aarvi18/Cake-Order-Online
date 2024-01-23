import express from "express";
const router = express.Router();
import {
  adminGetAllOrders,
  adminUpdateOrderStatus,
  createOrder,
  createPayment,
  userGetOrder,
  userGetOrders,
} from "../controllers/order.controller.js";

import {
  findAdminById,
  findUserById,
  isAdmin,
  isAuthenticate,
  isAuthenticateAdmin,
  isSignin,
} from "../middlewares/auth.middleware.js";
import {
  amoutChecker,
  checkOrderField,
  findOrderById,
  isProductAvailable,
  isValidateProducts,
} from "../middlewares/order.middleware.js";

router.param("userId", findUserById);
router.param("adminId", findAdminById);
router.param("orderId", findOrderById);

router.post(
  "/order/create/:userId",
  isSignin,
  isAuthenticate,
  checkOrderField,
  createOrder
);

router.post(
  "/order/create/payment/:userId",
  isSignin,
  isAuthenticate,
  checkOrderField,
  isValidateProducts,
  isProductAvailable,
  amoutChecker,
  createPayment
);

router.get(
  "/order/get/:userId/:orderId",
  isSignin,
  isAuthenticate,
  userGetOrder
);

router.get("/order/get/:userId", isSignin, isAuthenticate, userGetOrders);

// Admin can update order status
router.put(
  "/admin/dashboard/:adminId/orders/:orderId",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  adminUpdateOrderStatus
);

router.get(
  "/admin/get/:adminId/orders",
  isSignin,
  isAuthenticateAdmin,
  isAdmin,
  adminGetAllOrders
);

export default router;
