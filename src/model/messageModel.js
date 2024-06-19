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
    },
    mediaType: {
        type: String,
        default: "none",
        enum: ["image" , "video" , "none"]
    },
    publicId: {
        type: String
    },
    isRead: {
        type: Boolean,
        default : false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Messages", messageSchema);
