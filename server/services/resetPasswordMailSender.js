import transporter from "../config/mail.config.js";
import envConfig from "../config/env.config.js";
import CustomError from "./errorHandler.js";

const resetPasswordMailSender = async (options) => {
  try {
    const message = {
      from: envConfig.MAIL_EMAIL,
      to: options.email,
      subject: "Reset password",
      html: ` <h1>Hi ${options.name}</h1> 
      Please click on the following link to reset your password.
      <a href="${options.link}">Reset password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new CustomError("Something went wrong", 500);
  }
};

export default resetPasswordMailSender;
