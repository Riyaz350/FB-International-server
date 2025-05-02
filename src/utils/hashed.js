const bcrypt = require("bcrypt")

const verifyHashedData= async(hashed , pin)=>{
    try {

        const match = await bcrypt.compare(pin, hashed)
        return match
    } catch (error) {
        throw error
    }
}

const hashData = async(data, saltRound = 10)=>{
    try {
        const hashedData = await bcrypt.hash(data, saltRound)
        return hashedData
    } catch (error) {
        throw error
    }
}

module.exports= {hashData, verifyHashedData}