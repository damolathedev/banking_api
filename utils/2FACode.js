const mail = require('./sendMail')
// const mailClass = require('../test')

// const send2FACode = (email, code)=>{
//     const mail = new mailClass(process.env.EMAIL, process.env.EMAIL_PASSWORD, email, '2FA',`Your 2FA code is ${code}`)
//     return mail
// }

const send2FACode =(email,code)=>{
    mail(email,'2FA',`Your 2FA code is ${code}`)
}

module.exports = send2FACode