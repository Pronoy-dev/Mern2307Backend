const mongoose = require("mongoose");
const DbConnect = async () => {
    try {
        const databaseInstance = await mongoose.connect(process.env.DATABASE_URL)
        if (databaseInstance) {
            console.log("Database Connection Successfull")
        }
    } catch (error) {
        console.log('From MongoDb Database connection Error ', error)
    }
}

module.exports = { DbConnect }