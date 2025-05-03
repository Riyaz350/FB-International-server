const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Agent", "User", "Admin"],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    currentBalance: {
        type: Number,
        default: 0,
    },
    requestedBalance:{
        type: Number,
        default: 0,
    },
    approved:{
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
transaction.collection.dropIndex("mobile_1").catch((err) => {
    console.log("Index 'mobile_1' not found or already dropped:", err.message);
});
transaction.collection.dropIndex("email_1").catch((err) => {
    console.log("Index 'email_1' not found or already dropped:", err.message);
});


module.exports = transaction;
