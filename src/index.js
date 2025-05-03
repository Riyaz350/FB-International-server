const app = require("./app")
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const startApp = () => {
    app.listen(PORT, () => {
        console.log(`Running in ${PORT}`)
    })
}

startApp()