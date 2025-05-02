const express = require("express")
const router = express.Router()

const userRoutes = require("./../domains/users")
const checkUserRoutes = require("./../domains/users/check")

router.use("/users", userRoutes)
router.use("/users/check", checkUserRoutes)

module.exports = router