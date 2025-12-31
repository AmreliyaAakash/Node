const  express = require('express');
const app = express();
const userModel = require('./usermodel');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/create', async(req, res) => {
  let createdUser = await userModel.create({
            name: "Aakash",
            email: "Aakash@example.com",
            username: "A@kash"
        })
    res.send(createdUser);
});

app.get('/update', async (req, res) => {

 let updateduser  = await userModel. findOneAndUpdate({username: "A@kash"}, {name: "Aakash Amreliya"},{email: "Aakash@gamil.com"}, {new: true})

res.send(updateduser) ;

})

app.listen(3000);