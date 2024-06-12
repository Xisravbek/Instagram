const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    caption: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Posts", postsSchema);
