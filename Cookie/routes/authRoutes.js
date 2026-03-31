const express = require("express")
const router = express.Router()

const {
  getLogin,
  postLogin,
  getHome,
  logout
} = require("../controllers/authController")

const { isAuthenticated } = require("../middleware/authMiddleware")

router.get("/login", getLogin)
router.post("/login", postLogin)

router.get("/home", isAuthenticated, getHome)
router.get("/logout", logout)

module.exports = router
