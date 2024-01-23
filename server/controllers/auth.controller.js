import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";

import User from "../models/user.shema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../services/errorHandler.js";
import envConfig from "../config/env.config.js";
import authMailSender from "../services/authMailSender.js";
import resetPasswordMailSender from "../services/resetPasswordMailSender.js";

const emailTester = (email) => {
  let emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/******************************************************
 * @SIGNUP
 * @route http://localhost:8000/api/v1/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/
export const signup = asyncHandler(async (req, res) => {
  // Extact data from body
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    throw new CustomError("All field are required", 400);
  }
  if (!emailTester(email)) throw new CustomError("Invalid email", 400);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const verifyToken = jwt.sign(
    { id: uuidv4() },
    envConfig.EMAIL_VERIFY_TOKEN_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  const data = { name, email, password, verifyToken };

  const user = await User.create(data);

  const options = { _id: user._id, email, name, verifyToken };
  await authMailSender(options);

  user.password = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  user.verifyToken = undefined;

  res.status(200).json({
    success: true,
    user,
  });
});

/******************************************************
 * @SIGNIN
 * @ROLE USER
 * @route http://localhost:8000/api/v1/signin
 * @description User signIn Controller for loging new user
 * @parameters email, password
 * @returns User Object
 ******************************************************/
export const signin = asyncHandler(async (req, res) => {
  // Extact data from body
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new CustomError("All field are required", 400);
  }
  if (!emailTester(email)) throw new CustomError("Invalid email", 400);
  const user = await User.findOne({ email });

  if (!(user && (await user.comparePassword(password)))) {
    throw new CustomError("Invalid email or password.", 400);
  }

  // Check how many time user is longing our app
  await User.findByIdAndUpdate(
    user._id,
    { $inc: { loginCount: 1 } },
    { new: true }
  );

  user.password = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  user.verifyToken = undefined;

  const token = user.authJwtToken();

  res.cookie("sign_in", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    user,
    sign_in: token,
  });
});

/******************************************************
 * @SEND_VARIFICATION_TOKEN
 * @ROLE USER
 * @route http://localhost:8000/api/v1/user/resend/verificationmail/:userId
 * @description After expired token, user can also send a new token to their email for varification
 * @parameters userID(id)
 * @middleware isSignin, isAuthenticate
 * @returns
 ******************************************************/
export const sendVarificatoinToken = asyncHandler(async (req, res) => {
  const { _id } = req.auth;

  const user = await User.findOne({ _id });
  if (!user) throw new CustomError("Invalid user", 400);
  if (user.isVerified) throw new CustomError("You already varified", 400);

  const verifyToken = jwt.sign(
    { id: uuidv4() },
    envConfig.EMAIL_VERIFY_TOKEN_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  user.verifyToken = verifyToken;
  await user.save();

  const options = {
    _id: user._id,
    email: user.email,
    name: user.name,
    verifyToken,
  };
  authMailSender(options);

  return res.status(200).json({
    success: true,
    message: "Please confirm your email to continue",
  });
});

/******************************************************
 * @VERIFY_ACCOUNT
 * @ROLE USER
 * @route  http://localhost:8000/api/v1/user/verifyaccount
 * @description It will virify user Account
 * @parameters userID(id), varify_email_token
 * @returns User Object
 ******************************************************/
export const varifyAccount = asyncHandler(async (req, res) => {
  const { id, varify_email_token } = req.body;
  if (!(id?.length === 24 && varify_email_token))
    throw new CustomError("Invalid url", 400);
  jwt.verify(
    varify_email_token,
    envConfig.EMAIL_VERIFY_TOKEN_SECRET_KEY,
    (error, _) => {
      if (error) {
        throw new CustomError(
          "Sorry, the link in your verification email has expired. To complete your profile verification, please request a new verification email through your profile.",
          400
        );
      }
    }
  );

  const user = await User.findOne({
    _id: id,
    verifyToken: varify_email_token,
  });
  if (!user) throw new CustomError("Invalid url", 400);

  user.verifyToken = null;
  user.isVerified = true;
  await user.save();

  const token = user.authJwtToken();
  res.cookie("sign_in", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  user.password = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  user.verifyToken = undefined;

  return res.status(200).json({
    success: true,
    user,
    sign_in: token,
  });
});

/******************************************************
 * @GET_USER_FROM_TOKEN
 * @ROLE USER
 * @route  http://localhost:8000/api/v1/getuserfromtoken
 * @description It will virify user Account
 * @parameters
 * @middleware isSignin
 * @returns User Object
 ******************************************************/
export const getUserFromToken = asyncHandler(async (req, res) => {
  // Extact data from body
  const user = await User.findById(req.auth._id);
  if (!user) return res.status(400).json({ error: "Invalid User" });

  user.password = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  user.verifyToken = undefined;

  res.status(200).json({
    success: true,
    user,
  });
});

/******************************************************
 * @RECOVER_PASSWORD
 * @ROLE USER
 * @route  http://localhost:8000/api/v1/recover/password
 * @description Recover password send a (Recovery password) token to user Email
 * @parameters email
 * @returns
 ******************************************************/
export const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new CustomError("Enter email address", 400);
  if (!emailTester(email)) throw new CustomError("Invalid email", 400);
  const getUser = await User.findOne({ email });
  if (!getUser) throw new CustomError("User not found", 400);

  getUser.generateResetPasswordToken();

  const user = await getUser.save();

  let link = `${envConfig.DOMAIN_URL}/account/reset-password?id=${user._id}&reset_password_token=${user.resetPasswordToken}`;

  const options = { email, name: user.name, link };

  await resetPasswordMailSender(options);
  return res.status(200).json({
    success: true,
    message: "Chack you mail and reset your password",
  });
});

/******************************************************
 * @RESET_PASSWORD
 * @ROLE USER
 * @route  http://localhost:8000/api/v1/resetPassword/password
 * @description Reset password controller reset user passport
 * @parameters password, id, reset_password_token
 * @middleware
 * @returns
 ******************************************************/
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, id, reset_password_token } = req.body;

  if (!(id?.length === 24 && reset_password_token))
    throw new CustomError("Invalid url", 400);

  const user = await User.findOne({
    _id: id,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new CustomError("Password reset token has expired.", 400);

  if (user.resetPasswordToken !== reset_password_token) {
    throw new CustomError("Password reset token is invalid", 400);
  }
  if (!(password?.length >= 4))
    throw new CustomError("Password must be 4 charecter long", 400);

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

/******************************************************
 * @UPDATE_PROFILE
 * @ROLE USER
 * @route http://localhost:8000/api/v1/user/update/:userId
 * @description User signUp Controller for creating new user
 * @parameters name || photo, userId
 * @middleware isSignin, isAuthenticate
 * @returns User Object
 ******************************************************/
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = req.user;
  const data = { name };

  if (req.files) {
    const file = req.files.photo;
    if (user?.photo?.public_id) {
      await cloudinary.v2.uploader.destroy(user.photo.public_id);
    }
    let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "cack_order/users",
    });

    data.photo = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, data, {
    new: true,
  });

  updatedUser.password = undefined;
  updatedUser.resetPasswordExpires = undefined;
  updatedUser.resetPasswordToken = undefined;
  updatedUser.verifyToken = undefined;

  return res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

/******************************************************
 * @UPDATE_PASSWORD
 * @ROLE USER
 * @route http://localhost:8000/api/v1/user/update/password/:userId
 * @description Update passport will update user password
 * @parameters userId, old_password, new_password
 * @middleware isSignin, isAuthenticate
 * @returns
 ******************************************************/
export const updatePassword = asyncHandler(async (req, res) => {
  const { old_password, new_password } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.comparePassword(old_password)))
    throw new CustomError("Old password is wrong");

  user.password = new_password;
  await user.save();

  user.password = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordToken = undefined;
  user.verifyToken = undefined;

  return res.status(200).json({
    success: true,
    message: user,
  });
});

/******************************************************
 * @GET_ALL_USER
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/admin/dashboard/:adminId/users
 * @description Admin has access to Reguler user info
 * @parameters adminId,
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns User Object
 ******************************************************/
export const adminGetAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  for (const user of users) {
    user.password = undefined;
  }
  return res.status(200).json({
    success: true,
    users,
  });
});

/******************************************************
 * @UPDATE_USER_ROLE
 * @ROLE ADMIN
 * @route http://localhost:8000/api/v1/admin/dashboard/:adminId/users/:userId/update/role
 * @description Admin has access to Update user role
 * @parameters userId,role
 * @middleware isSignin, isAuthenticateAdmin, isAdmin,
 * @returns User Object
 ******************************************************/
export const adminUpdateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role) throw new CustomError("Role is requried", 400);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role },
    { new: true }
  );
  user.password = undefined;
  return res.status(200).json({
    success: true,
    user,
  });
});
