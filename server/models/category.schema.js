import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is requried"],
      unique: true,
      trim: true,
      maxLength: [220, "must be under 220 chanrecter"],
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
