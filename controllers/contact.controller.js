import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("Contact form data:", req.body);

    // 🔥 TRANSPORTER SETUP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📩 EMAIL CONTENT
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // apni email pe receive kar rahe ho
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Message Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    };

    // 🚀 SEND EMAIL
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);

    return res.status(200).json({
      message: "Message sent successfully",
    });

  } catch (error) {
    console.log("Controller error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};