const nodemailer = require('nodemailer');

class Mail{
    constructor(from,password, to, subject, text){
        this.from = from
        this.password = password
        this.to = to
        this.subject = subject
        this.text = text
    }
    sendMail(){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.from,
                pass: this.password,
            },
        });
    
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: this.subject,
            text: this.text,
        };
    
        transporter.sendMail(mailOptions);
    }
}

module.exports = Mail