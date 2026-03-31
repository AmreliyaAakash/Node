const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())

// =====================
// DATABASE CONNECTION
// =====================
mongoose.connect("mongodb://localhost:27017/mvc_one_file")

mongoose.connection.on("connected", () => {
    console.log("Database Connected")
})

// =====================
// MODEL (Schema)
// =====================
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model("User", userSchema)

// =====================
// CONTROLLER (Logic)
// =====================

// ADD USER
const addUser = async (req, res) => {
    const data = await User.create(req.body)
    res.send(data)
}

// GET USERS
const getUser = async (req, res) => {
    const data = await User.find({})
    res.send(data)
}

// UPDATE USER
const updateUser = async (req, res) => {
    const id = req.params.id
    const data = await User.findByIdAndUpdate(id, req.body)
    res.send(data)
}

// DELETE USER
const deleteUser = async (req, res) => {
    const id = req.params.id
    await User.findByIdAndDelete(id)
    res.send("User Deleted")
}

// =====================
// ROUTES
// =====================
app.post("/add", addUser)
app.get("/", getUser)
app.patch("/:id", updateUser)
app.delete("/:id", deleteUser)

// =====================
// SERVER
// =====================
app.listen(7880, () => {
    console.log("Server running on port 7880")
})
