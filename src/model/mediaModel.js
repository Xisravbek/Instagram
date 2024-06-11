const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    },
    mediaType: {
        enum: ["mp4", "png", "img"],
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Media", mediaSchema);
