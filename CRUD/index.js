const express = require("express");
const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// Student data 
let student = [
  { id: 1, name: "Aakash" },
  { id: 2, name: "Vraj" }
];

// READ 
app.get("/", (req, res) => {
  res.render("form", { student });
});

// CREATE (Insert Data)
app.post("/insertData", (req, res) => {
  const { id, name } = req.body;
  student.push({ id: Number(id), name });
  res.redirect("/");
});

// DELETE
app.get("/delete", (req, res) => {
  const id = Number(req.query.id);
  student = student.filter(el => el.id !== id);
  res.redirect("/");
});

// EDIT PAGE
app.get("/edit", (req, res) => {
  const id = Number(req.query.id);
  const ans = student.find(el => el.id === id);
  res.render("edit", { editValue: ans });
});

// UPDATE 
app.post("/editData", (req, res) => {
  const { id, name } = req.body;

  student = student.map(el =>
    el.id === Number(id) ? { id: Number(id), name } : el
  );

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
