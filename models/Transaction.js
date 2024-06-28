const mongoose = require('mongoose')


const Transaction = new mongoose.Schema({
    amount:{
        type: Number,
        required: true,
    },
})