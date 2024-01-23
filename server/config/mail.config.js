import nodemailer from "nodemailer";
import envConfig from "../config/env.config.js";

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: envConfig.MAIL_HOST,
  service: "gmail",
  secure: false,
  auth: {
    user: envConfig.MAIL_USERNAME,
    pass: envConfig.MAIL_PASSWORD,
  },
});

export default transporter;
