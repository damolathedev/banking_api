require('dotenv').config()
const nodemailer = require('nodemailer');

const sendMail = async (email, subject, text) => {
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
        subject: subject,
        text: text,
    };

    await transporter.sendMail(mailOptions);
};



module.exports = sendMail;