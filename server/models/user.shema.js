import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import AuthRoles from "../utils/authRoles.js";
import envConfig from "../config/env.config.js";

const { Schema, model } = mongoose;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [25, "Name must be under 25 chanrecter"],
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
    },

    password: {
      type: String,
      minLength: [4, "Password must be at least 4 charecter long"],
      required: [true, "Password is required"],
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: {
      type: String,
      default: null,
    },

    photo: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods = {
  // Compare password
  comparePassword: async function (providedPassword) {
    return await bcrypt.compare(providedPassword, this.password);
  },

  //generate JWT TOKEN
  authJwtToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      envConfig.JWT_SECRET_AUTH,
      {
        expiresIn: envConfig.JWT_EXPIRY,
      }
    );
  },

  // Reset password
  generateResetPasswordToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpires = Date.now() + 20 * 60 * 1000;
    return resetToken;
  },
};

export default model("User", userSchema);
