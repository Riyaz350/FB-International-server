const { hashData, verifyHashedData } = require("./../../utils/hashed");
const agent = require("../schema/agent");



const createUser = async (data) => {
    try {
        const hashedPin = await hashData(data.pin);
        const newData = { ...data, pin: hashedPin };
        const newUser = new agent(newData);
        newUser.save();
        return { success: true, user: newUser };
    } catch (error) {
        return { success: false, error: error.message };
    }
};