const mongoose = require("mongoose");

const followsModel = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    followedId: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Follows", followsModel);
