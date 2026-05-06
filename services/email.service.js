// services/email.service.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: email,
    to: process.env.EMAIL,
    subject: `New Contact from ${name}`,
    text: message,
  });
};
