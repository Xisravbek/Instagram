const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    text: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Comments", commentsSchema);
