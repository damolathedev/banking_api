const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      deviceIdentifier: String,
      lastUsed: Date
})

module.exports = mongoose.model('Device', DeviceSchema)