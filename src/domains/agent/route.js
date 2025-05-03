const express = require("express");
const dbConnect = require("../../config/db");


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