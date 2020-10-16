const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    const testAccount = await nodemailer.createTestAccount();


    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_EMAIL}  <${process.env.FROM_NAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;