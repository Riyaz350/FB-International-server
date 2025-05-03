const express = require("express");
const { createUser, verifyUserPin, updateUserBalance } = require("./controller");
const {createToken , decodeToken} = require("./../../utils/createToken");
const dbConnect = require("../../config/db");
const user = require("../schema/user");

const router = express.Router();

router.use(express.json());

// GET route
router.get("/", async (req, res) => {
    try {
        await dbConnect();
        res.status(200).json({ message: "Databases connected successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to the database" });
    }
});

router.get("/allUsers", async (req, res) => {
    try {
        await dbConnect();
        const users = await user.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/", async (req, res) => {
    try {
        await dbConnect();
        const body = req.body;
        const user = await createUser(body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

router.post("/verifyAgent", async (req, res) => {
    try {
        await dbConnect();
        const { userId, balance } = req.body;
        const result = await updateUserBalance(userId, balance);
        const existingUser = result.user;
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({ message: "User verified successfully", user: existingUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to verify agent" });
    }
});

router.post("/verifyPin", async (req, res) => {
    try {
        await dbConnect();
        const { identifier, pin } = req.body;
        
        const result = await verifyUserPin( identifier , pin);

        if (result.isMatch) {
            const token = await createToken({ identifier });
            res.status(200).json({ isMatch: result.isMatch, token: token });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to verify user pin" });
    }
});

router.post("/verifyToken", async (req, res) => {
    try {
        await dbConnect();
        const { token } = req.body;
        const decoded = await decodeToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const userData = await user.findOne({ $or: [{ mobile: decoded.identifier }, { email: decoded.identifier }] });
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: "Failed to verify token" });
    }
});

router.post("/balanceRequest", async (req, res) => {
    try {
        await dbConnect();
        const { userId, balance } = req.body;

        const existingUser = await user.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        existingUser.requests.push({ balance, approved:false, createdAt: new Date() });
        await existingUser.save();

        res.status(200).json({ message: "Balance request updated successfully", user: existingUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to process balance request" });
    }
});


module.exports = router;
