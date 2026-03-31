

const express = require('express');
const app = express();
const userModel = require('./model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const path = require('path');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });

            let token = jwt.sign({ email }, "Shuup")
            res.cookie("token", token)
            res.send(createdUser);
        });
    })
});

app.get("/login", function (req, res) {
    res.render("login")
})

app.post("/login", async function (req, res) {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) return res.send("kya bhai kya hack karne ki try ya sach me bhul gaya")

    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email :user.email }, "Shuup")
            res.cookie("token", token)
    
        }
        else res.send("kya bhai kya hack karne ki try ya sach me bhul gaya")
    })
})

app.get("/logout", function (req, res) {
    res.cookie("token", "")
    res.redirect("/")
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});