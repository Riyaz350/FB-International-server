const user = require("../schema/user");
const { hashData, verifyHashedData } = require("./../../utils/hashed");
const {createToken , decodeToken} = require("./../../utils/createToken");

const createUser = async (data) => {
    try {
        const hashedPin = await hashData(data.pin);
        const newData = { ...data, pin: hashedPin };
        const newUser = new user(newData);
        newUser.save();
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const verifyUserPin = async (identifier , pin) => {
    try {
        const userData = await user.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
        if (!userData) {
            return { success: false, error: "User not found" };
        }
        const isMatch = await verifyHashedData(userData.pin , pin);
        
        return { success: true, isMatch };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


const updateUserBalance = async (userId, balance) => {
    try {
        const existingUser = await user.findOne({ _id: userId });
        if (!existingUser) {
            return { success: false, error: "User not found" };
        }

        existingUser.verified = true;
        existingUser.balance = (existingUser.balance || 0) + balance;
        await existingUser.save();

        return { success: true, user: existingUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


module.exports = { createUser, verifyUserPin, updateUserBalance };
