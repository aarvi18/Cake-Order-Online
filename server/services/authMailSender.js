import transporter from "../config/mail.config.js";
import envConfig from "../config/env.config.js";
import CustomError from "./errorHandler.js";

const authMailSender = async (options) => {
  try {
    const message = {
      from: envConfig.MAIL_EMAIL,
      to: options.email,
      subject: "Verify the email ✔",
      html: `<h2> Dear ${options.name} </h2>
        <h3>Thank you for registering on our site! We are excited to have you as a member. To ensure a seamless experience, please verify your email by clicking on the link we have sent to your inbox. This will allow you to continue using our services.</h3>
        <a href="${envConfig.DOMAIN_URL}/user/e/verify-email?id=${options._id}&varify_email_token=${options.verifyToken}">Varify Your Account</a>`,
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new CustomError("Verification mail send failed. Resend it.");
  }
};

export default authMailSender;
