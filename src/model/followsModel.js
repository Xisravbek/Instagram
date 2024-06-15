const mongoose = require("mongoose");

const followsModel = new mongoose.Schema({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required:true
    },
    followedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Follows", followsModel);
