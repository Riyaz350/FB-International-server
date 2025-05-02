const express = require("express");
const { createUser, verifyUserPin } = require("./controller");
const dbConnect = require("../../config/db");

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

router.post("/verify", async (req, res) => {
    try {
        await dbConnect();
        const { identifier, pin } = req.body;
        const result = await verifyUserPin( identifier , pin);
        if (result.success) {
            res.status(200).json({ isMatch: result.isMatch });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to verify user pin" });
    }
});


module.exports = router;
