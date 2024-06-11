const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true 
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Users", userSchema);
