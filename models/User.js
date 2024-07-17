const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const validator = require('validator');
const crypto = require('crypto');
const {parsePhoneNumberFromString} = require('libphonenumber-js')
const compareProperty = require('../utils/compareProperty');

const UserSchema =new mongoose.Schema({
    firstName:{
        type: String,
        // required: true,
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
        // required: true,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters']
    },
    gender:{
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    dateOfBirth:{
        type: Date,
        // required: true,
    },
    email:{
        type: String,
        required: true,
        minLength: [3, 'Name must not be less than three characters'],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: [true, 'user with email already exist']
    },
    profilePic:{
        type:String
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v){
                const phoneNUmber = parsePhoneNumberFromString(v)
                return phoneNUmber && phoneNUmber.isValid()
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        unique: [true, 'user with phone number already exist, consider loging in']
    },
    accountNumber: {
        type: String,
        // required: true,
        unique: true
    },
    pin: {
        type: String,
        required:true
    },
    deviceIdentifiers: [String],
    twofactorCode: String,
    twofactorCodeExpiry: Date,
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


UserSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.middleName ? this.middleName : ''} ${this.lastName}`
})
function generateUniqueAccountNumber(){
    const min = 1000000000
    const max = 9999999999
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    return String(randomNumber).padStart(10, '0')
}


UserSchema.pre('save', async function(){
    if(!this.isModified('pin')) return;
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)

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
})


UserSchema.methods.comparePin = async function (candidatePin) {
    return bcrypt.compare(candidatePin, this.pin);
};


UserSchema.methods.generateTwofactorCode = function () {
    const code = crypto.randomInt(100000, 999999).toString();
    this.twofactorCode = bcrypt.hashSync(code, 10);
    this.twofactorCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return code;
};


UserSchema.methods.compareTwofactorCode = async function (code) {
    if (Date.now() > this.twofactorCodeExpiry) {
        return false;
    }
    return bcrypt.compare(code, this.twofactorCode);
};
module.exports = mongoose.model('User', UserSchema);
