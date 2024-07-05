require('dotenv').config()
const crypto = require('crypto')
const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

const send2FACode= async(user)=>{
    const twoFactorCode = crypto.randomBytes(3).toString('hex')
    user.twofactorCode = twoFactorCode

    console.log(twoFactorCode)

    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Your 2FA code',
        text: `Your 2FA code is ${twoFactorCode}, Please do not share with anyone`
    }

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Email send: '+info.response)
        }
    })
}

module.exports = send2FACode