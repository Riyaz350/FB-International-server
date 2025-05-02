const jwt = require("jsonwebtoken")
const key = process.env.TOKEN_KEY
const createToken = async (tokenData, tokenKey =key ) => {
    try {
        const token = await jwt.sign(tokenData, tokenKey)
        return token
    } catch (error) {
        throw error
    }
}

const decodeToken = (token) => {
    try {
        const verifiedData = jwt.verify(token,key); 
        return verifiedData;
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

module.exports = {createToken , decodeToken}