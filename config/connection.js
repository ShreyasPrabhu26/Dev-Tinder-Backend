const mongoose = require("mongoose");

async function connectToDatabase(connectionString) {
    try {
        await mongoose.connect(connectionString);
    } catch (err) {
        throw new Error("Database Connection Failed!", err)
    }
}

module.exports = connectToDatabase;