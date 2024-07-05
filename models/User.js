const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const validator = require('validator');
const {parsePhoneNumberFromString} = require('libphonenumber-js')
const compareProperty = require('../utils/compareProperty')


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
        },
        unique: [true, 'user wiht phone number alreadu exist, consider loging in']
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
    deviceIdentifier: {
        type:String,
        // default:"device"
      },
      twofactorCode:{
        type: String,
        default: "helloo"
      }
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


UserSchema.pre('save', async function(next){
    if(!this.isModified('deviceIdentifier')) return;
    const salt = await bcrypt.genSalt(10)
    this.deviceIdentifier = await bcrypt.hash(this.deviceIdentifier, salt)
    next()
})


UserSchema.pre('save', async function(next){
    if(!this.isModified('pin')) return;
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
    next()
})

UserSchema.pre('save', async function(next){
    if(!this.isModified('twofactorCode')) return;
    const salt = await bcrypt.genSalt(10)
    this.twofactorCode = await bcrypt.hash(this.twofactorCode, salt)
    next()
})


//remember you want to create a function to handle comparing data entry from user with the hashed one in the database
UserSchema.methods.comparePin = async function(candidatePin){
    const isMatch = await bcrypt.compare(candidatePin, this.pin)
    return isMatch
}

//campare with the function created
// UserSchema.methods.comparePin = function(data){
//     compareProperty(data, this.pin)
// }

UserSchema.methods.compareDevice = async function(deviceInfo){
    const isMatch = await bcrypt.compare(deviceInfo, this.deviceIdentifier)
    return isMatch
}

UserSchema.methods.compareTwofactorCode = async function(twoFactorCode){
    const isMatch = await bcrypt.compare(twoFactorCode, this.twoFactorCode)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)