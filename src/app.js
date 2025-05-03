require("./config/db")

const express = require("express")
const bodyParser = express.json
const cors = require("cors")
const routes = require("./routes")


const app = express()
const allowedOrigins = ["http://localhost:3000", "https://fb-international.vercel.app"];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


app.use(bodyParser())
app.use("/api/v1", routes)

module.exports = app