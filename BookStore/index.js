const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");

const app = express();
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/bookstore")
  .then(async () => {
    console.log("MongoDB Connected");

    const count = await Book.countDocuments();

    if (count === 0) {
      await Book.insertMany([
        {
          title: "Atomic Habits",
          author: "James Clear",
          price: 450,
          category: "Self Help",
          publishedYear: 2018
        },
        {
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 650,
          category: "Programming",
          publishedYear: 2008
        },
        {
          title: "The Alchemist",
          author: "Paulo Coelho",
          price: 300,
          category: "Fiction",
          publishedYear: 1988
        }
      ]);

      console.log("Dummy books inserted");
    }
  })
  .catch(err => console.log(err));


app.get("/", async (req, res) => {
  const books = await Book.find({});
  res.render("books", { books });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
