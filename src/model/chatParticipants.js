const mongoose = require("mongoose");

const chatParticipantsSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat"
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
},
{
    timestamps: true
});

module.exports = mongoose.model("ChatParticipants", chatParticipantsSchema);
