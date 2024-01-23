import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus.js";

const { Schema } = mongoose;

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },

      city: {
        type: String,
        required: [true, "City is required"],
      },

      phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
      },

      postalCode: {
        type: String,
        required: [true, "Enter your area pin code"],
      },

      state: {
        type: String,
        required: [true, "State is required"],
      },

      country: {
        type: String,
        default: "India",
      },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    paymentInfo: {
      razorpay_order_id: {
        type: String,
        required: true,
      },
      razorpay_payment_id: {
        type: String,
        required: true,
      },
      razorpay_signature: {
        required: true,
        type: String,
      },
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    shippingAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PROCESSING,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
