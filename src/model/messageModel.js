const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat"
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    content: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Messages", messageSchema);
