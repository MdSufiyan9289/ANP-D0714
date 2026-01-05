const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    message: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Message", messageSchema);