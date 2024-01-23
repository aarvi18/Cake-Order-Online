import jwt from "jsonwebtoken";

import envConfig from "../config/env.config.js";
import User from "../models/user.shema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/errorHandler.js";

export const isSignin = asyncHandler(async (req, _res, next) => {
  const token =
    req.headers?.authorization?.replace("Bearer ", "") ||
    req.headers?.cookie?.replace("sign_in=", "") ||
    req.body.token;

  const verify = jwt.verify(token, envConfig.JWT_SECRET_AUTH);
  req.auth = verify;
  next();
});

export const isAuthenticate = asyncHandler(async (req, _res, next) => {
  if (!req.user._id.equals(req.auth._id))
    throw new CustomError("You are not authenticate", 400);

  next();
});

export const findUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(400).json({ error: "Invalid User" });
    user.password = undefined;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid User" });
  }
};

// Admin middleware
export const isAdmin = asyncHandler(async (req, _res, next) => {
  if (!(req.admin.role === "ADMIN" && req.auth.role === "ADMIN"))
    throw new CustomError("You are not Admin", 400);
  next();
});

export const findAdminById = async (req, res, next, id) => {
  try {
    const admin = await User.findById(id);
    if (!admin) return res.status(400).json({ error: "Invalid admin Id" });
    admin.password = undefined;
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid admin Id" });
  }
};

export const isAuthenticateAdmin = asyncHandler(async (req, _res, next) => {
  if (!req.admin._id.equals(req.auth._id))
    throw new CustomError("You are not authenticate admin", 400);

  next();
});
