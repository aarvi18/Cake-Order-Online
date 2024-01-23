import Product from "../models/product.schema.js";

export const findProductById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(400).json({ error: "Invalid ProductId" });
    req.product = product;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid ProductId" });
  }
};
