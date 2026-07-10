import nodemailer from "nodemailer";
import AppError from "./app_error.js";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text = "",
}) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Email Error:", error);

    throw new AppError(
      "Failed to send email.",
      500
    );
  }
};