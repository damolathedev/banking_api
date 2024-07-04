const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      deviceIdentifier: {
        type:String,
        default:"device"
      },
      lastUsed: Date
})

module.exports = mongoose.model('Device', DeviceSchema)