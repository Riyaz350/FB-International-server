const express = require("express");
const dbConnect = require("../../config/db.js");
const user = require("../schema/user.js");
const transaction = require("../schema/transaction.js");
const router = express.Router();

router.get("/transactions", async (req, res) => {
    try {
        await dbConnect();
        const transactions = await transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

router.post("/balanceRequest", async (req, res) => {
    try {
        await dbConnect();
        const { userId, requestedBalance } = req.body;
        
        const existingUser = await user.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const newTransaction =  new transaction({
            type:"Request",
            name: existingUser.name,
            userId: existingUser._id,
            accountType: existingUser.accountType,
            verified: existingUser.verified,
            currentBalance: existingUser.balance,
            requestedBalance:requestedBalance,
            approved: false
        });

        console.log('newTransaction',newTransaction)

        await newTransaction.save();
        
        res.status(200).json({ message: "Balance request created successfully", transaction: newTransaction });
    } catch (error) {
        console.log('err',error)
        res.status(500).json({ error: "Failed to process balance request" });
    }
});

router.post("/updateBalance", async (req, res) => {
    try {
        await dbConnect();
        console.log('aa',req.body)
        
        const { userId, balance } = req.body;
        const existingUser = await user.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        existingUser.balance += balance;
        await existingUser.save();

        res.status(200).json({ message: "Balance updated successfully", user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update balance" });
    }
});

router.post("/approveTransaction", async (req, res) => {
    try {
        await dbConnect();
        const { transactionId } = req.body;
        
        const existingTransaction = await transaction.findOne({ _id: transactionId });
        if (!existingTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        existingTransaction.approved = true;
        await existingTransaction.save();

        res.status(200).json({ message: "Transaction approved successfully", transaction: existingTransaction });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to approve transaction" });
    }
});

module.exports = router;