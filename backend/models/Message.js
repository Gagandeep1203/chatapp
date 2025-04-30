const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    // We might add recipient or room later depending on chat type (1-on-1 vs group)
    // recipient: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    // room: {
    //     type: String,
    // },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 