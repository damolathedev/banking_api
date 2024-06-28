const mongoose = require('mongoose')


const AccountInfo = new mongoose.Schema({
    accountBalance: {
        type: Number,
        default: 0
    },
    trancastionHistory:{
        type: mongoose.Types.ObjectId,
        ref: 'Transaction',
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    homeAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    occupation: {
        type: String,
        required: true,
    },
    annualIncome: {
        type: Number,
        required: true
    },
    termsAndContition: {
        type: Boolean,
        require: true,
        default: false
    },
    privatePolicyAggrement: {
        type: Boolean,
        required: true,
        default: false
    },
    communicationMethod: {
        type: String,
        required: true,
        enum: ["Email", "SMS", "Phone call"],
    }

})

userSchema.virtual('fullName').get(()=>{
    return `${this.firstname} ${this.middlename ? this.middlename + ' ' : ''}${this.lastname}`;
})

module.exports = mongoose.model('AccountInfo', AccountInfo)