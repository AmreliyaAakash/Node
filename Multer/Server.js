const express = require("express")
const path = require("path")
const multer = require("multer")
const mongoose = require("mongoose")
const userModel = require("./model/userModel")

const app = express()


mongoose.connect("mongodb://127.0.0.1:27017/uploadDB")


app.set("view engine", "ejs")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/upload", express.static(path.join(__dirname, "upload")))



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/")
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })




app.post("/insert", upload.single("image"), async (req, res) => {

  await userModel.create({
    username: req.body.username,
    password: req.body.password,
    image: req.file.filename
  })

  res.redirect("/")
})




app.get("/", async (req, res) => {

  const data = await userModel.find()

  res.render("form", { data })
})




app.get("/delete/:id", async (req, res) => {

  await userModel.findByIdAndDelete(req.params.id)
  
  res.redirect("/")
  
})



app.get("/edit/:id", async (req, res) => {

  const user = await userModel.findById(req.params.id)

  res.render("edit", { user })
})




app.post("/update/:id", upload.single("image"), async (req, res) => {


  const oldData = await userModel.findById(req.params.id)

  let updateData = {
    username: req.body.username,
    password: req.body.password,
    image: oldData.image   
  }
  if (req.file) {
    updateData.image = req.file.filename
  }
  await userModel.findByIdAndUpdate(req.params.id, updateData)
  res.redirect("/")
})




app.listen(3000, () => {
  console.log("🔥 Server running on port 3000")
})
