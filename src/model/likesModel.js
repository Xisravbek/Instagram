const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Likes", likeSchema);
