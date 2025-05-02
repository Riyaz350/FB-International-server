const user = require("./model");
const { hashData, verifyHashedData } = require("./../../utils/hashed");

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
        console.log(identifier);
        const userData = await user.findOne({ $or: [{ mobile: identifier }, { email: identifier }] });
        if (!userData) {
            return { success: false, error: "User not found" };
        }
        console.log(userData);
        const isMatch = await verifyHashedData(userData.pin , pin);
        console.log(isMatch);
        return { success: true, isMatch };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { createUser, verifyUserPin };
