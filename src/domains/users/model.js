const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
        min: 9999,
        max: 10000,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Agent", "User", "Admin"],
    },
    nid: {
        type: Number,
        required: true,
        unique: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
    },
});

const user = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = user;
