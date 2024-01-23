// import razorpay from "../config/razorpay.config.js";
import CustomError from "./errorHandler.js";

const razorpayPayment = async ({ totalAmount, receipt, notes }) => {
  try {
    var options = {
      amount: totalAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: receipt,
      notes: notes,
    };
    // Create a payment order
    const payment_order = await razorpay.orders.create(options);

    // callback
    return payment_order;
  } catch (error) {
    throw new CustomError("Payment faield", 500);
  }
};

export default razorpayPayment;
