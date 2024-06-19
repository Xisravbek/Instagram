const mongoose = require("mongoose");

const checkBanSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    },
    banText: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("CheckBan", checkBanSchema);
