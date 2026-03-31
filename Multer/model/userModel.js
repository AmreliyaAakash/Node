const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    image: {
        type: String
    }
})

const userModel = new mongoose.model("Aakash", userSchema)

module.exports = userModel