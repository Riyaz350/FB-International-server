require("dotenv").config();

const config = {
  mongodb: {
    uri:
      process.env.MONGODB_URI
  },
};
module.exports = config;