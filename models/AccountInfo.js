const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    first_name:{
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
        required: true
    },
    email:{
        type: String,
        required: true,
        minLength: [3, 'Name must not be less than three characters'],
        maxlength: [20, 'Name must not be more than 20 cahracters']
    }

})

userSchema.virtual('fullName').get(()=>{
    return `${this.firstname} ${this.middlename ? this.middlename + ' ' : ''}${this.lastname}`;
})