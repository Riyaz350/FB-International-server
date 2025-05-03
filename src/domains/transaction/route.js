const express = require("express");
const dbConnect = require("../../config/db.js");
const user = require("../schema/user.js");
const transaction = require("../schema/transaction.js");
const router = express.Router();
const { createUser, verifyUserPin, updateUserBalance } = require("../users/controller");

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

router.post("/cashIn", async (req, res) => {
    try {
        await dbConnect();
        const { agentMail, mobile, balance, pin } = req.body;

        const response = await verifyUserPin(agentMail, pin);
        if (!response.isMatch) {
            return res.status(401).json({ error: "Invalid PIN" });
        }

        const agentUser = await user.findOne({ email: agentMail });
        if (!agentUser) {
            return res.status(404).json({ error: "Agent not found" });
        }

        if (agentUser.balance < balance) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        agentUser.balance -= balance;
        await agentUser.save();

        const existingUser = await user.findOne({ mobile: mobile });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const updatedBalance = await updateUserBalance(existingUser._id, balance);
        if (!updatedBalance.success) {
            return res.status(404).json({ error: updatedBalance.error });
        }

        res.status(200).json({ message: "CashIn transaction created successfully"  });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to process CashIn transaction" });
    }
});

router.post("/sendMoney", async (req, res) => {
    try {
        await dbConnect();
        const { userMail, mobile, balance, pin } = req.body;

        const response = await verifyUserPin(userMail, pin);
        if (!response.isMatch) {
            return res.status(401).json({ error: "Invalid PIN" });
        }

        const receiverUser = await user.findOne({ mobile: mobile });
        if (!receiverUser) {
            return res.status(404).json({ error: "Recipient not found" });
        }
        const sendingUser = await user.findOne({ email: userMail });
        if (!sendingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (sendingUser.balance < balance) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        sendingUser.balance -= balance+5;
        await sendingUser.save();

        const receivingUser = await user.findOne({ mobile: mobile });
        if (!receivingUser) {
            return res.status(404).json({ error: "Receiving user not found" });
        }
        
        const updatedBalance = await updateUserBalance(receivingUser._id, balance);
        if (!updatedBalance.success) {
            return res.status(404).json({ error: updatedBalance.error });
        }

        const adminUser = await user.findOne({ accountType: "Admin" });
        if (adminUser) {
            adminUser.balance += 5;
            await adminUser.save();
        }

        res.status(200).json({ message: "SendMoney transaction created successfully"  });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to process SendMoney transaction" });
    }
});

router.post("/cashOut", async (req, res) => {
    try {
        await dbConnect();
        const { mobile, amount, pin } = req.body;

        const response = await verifyUserPin(mobile, pin);
        if (!response.isMatch) {
            return res.status(401).json({ error: "Invalid PIN" });
        }

        const agentUser = await user.findOne({ mobile: mobile });
        if (!agentUser || agentUser.accountType !== "Agent") {
            return res.status(404).json({ error: "Agent not found or user is not an agent" });
        }

        const deduction = amount * 0.015;
        const netAmount = amount - deduction;
        const agentIncome = deduction * 0.01;
        const adminIncome = deduction * 0.005;

        agentUser.balance += netAmount;
        agentUser.income = (agentUser.income || 0) + agentIncome;
        await agentUser.save();

        const adminUser = await user.findOne({ accountType: "Admin" });
        if (adminUser) {
            adminUser.income = (adminUser.income || 0) + adminIncome;
            await adminUser.save();
        }

        res.status(200).json({ message: "CashOut transaction processed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to process CashOut transaction" });
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