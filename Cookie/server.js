const express = require("express")
const session = require("express-session")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.set("view engine", "ejs")

// ✅ VERY IMPORTANT
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false
  })
)

// redirect root to login
app.get("/", (req, res) => {
  res.redirect("/login")
})

app.use("/", authRoutes)

app.listen(3000, () => {
  console.log("Server running → http://localhost:3000")
})
