const express = require("express");
const user = require("../model");
const dbConnect = require("../../../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await dbConnect();
        const { mobile, email, nid } = req.body;
        const existingMobile = await user.findOne({ mobile });
        const existingEmail = await user.findOne({ email });
        const existingNID = await user.findOne({ nid });

        if (existingMobile || existingEmail || existingNID) {
            return res.status(400).json({
                exists: true,
                mobile: !!existingMobile,
                email: !!existingEmail,
                nid: !!existingNID
            });
        }

        return res.status(200).json({
            exists: false
        });

    } catch (error) {
        return res.status(500).json({ 
            error: "Failed to check existing data",
            details: error.message 
        });
    }
});

module.exports = router;
