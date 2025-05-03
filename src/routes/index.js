const express = require("express")
const router = express.Router()

const userRoutes = require("./../domains/users")
const checkUserRoutes = require("./../domains/users/check")
const transactionRoutes = require("./../domains/transaction")

router.use("/users", userRoutes)
router.use("/users/check", checkUserRoutes)
router.use("/transaction", transactionRoutes)

module.exports = router