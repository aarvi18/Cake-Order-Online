import Category from "../models/category.schema.js";

export const findCategoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    if (!category)
      return res
        .status(400)
        .json({ error: "This Category is no longer existed" });

    req.category = category;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "This Category is no longer existed" });
  }
};
