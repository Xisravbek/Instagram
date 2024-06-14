const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref: "Posts"
    },
    mediaType: {
        type: String,
        default: "none",
        enum: ["mp4", "png", "img", "image", "video", "none"]
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required : true
    }
});

module.exports = mongoose.model("Media", mediaSchema);
