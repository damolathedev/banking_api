const mongoose = require('mongoose')
const validator = require('validator');
const {parsePhoneNumberFromString} = require('libphonenumber-js')

const UserSchema =new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters']
    },
    middleName:{
        type: String,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters']
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters']
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    dateOfBirth:{
        type: Date,
        required: true,
    },
    email:{
        type: String,
        required: true,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters'],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: [true, 'user with email already exist']
    },
    phoneNUmber: {
        type: String,
        required: true,
        validate: {
            validator: function (v){
                const phoneNUmber = parsePhoneNumberFromString(v)
                return phoneNUmber && phoneNUmber.isValid()
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
})

function generateUniqueAccountNumber(){
    const min = 1000000000
    const max = 9999999999
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return String(randomNumber).padStart(10, '0')
}

UserSchema.pre('save', async function(next){
    if(!this.accountNumber){
        let generatedAccountNumber
        while(!generatedAccountNumber){
            const candidateAccountNumber = generateUniqueAccountNumber()
            const existingUser = await this.constructor.findOne({accountNumber: candidateAccountNumber})
            if(!existingUser){
                generatedAccountNumber = candidateAccountNumber
            }
        }
        this.accountNumber = generatedAccountNumber
    }
    next()
})

module.exports = mongoose.model('User', UserSchema)