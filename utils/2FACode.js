require('dotenv').config()
const nodemailer = require('nodemailer');

const send2FACode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = send2FACode;