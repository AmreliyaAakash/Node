const mongoose = require('mongoose');   

mongoose.connect('mongodb://localhost:27017/mydatabase');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String
});

module.exports = mongoose.model("User", userSchema);
