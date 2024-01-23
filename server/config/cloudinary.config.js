import cloudinary from "cloudinary";
import envConfig from "./env.config.js";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECTET,
  secure: true,
});
