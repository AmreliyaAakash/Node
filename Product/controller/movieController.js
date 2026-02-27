const Movie = require("../Models/MovieModel");


exports.getAllMovies = async (req, res) => {
   const movies = await Movie.find().sort({ createdAt: -1 });
   res.render('index', { movies });
};


exports.createPage = async (req, res) => {
   res.render('create');
};


exports.createMovie = async (req, res) => {
   await Movie.create({
      title: req.body.title,
      releaseYear: req.body.releaseYear,
      description: req.body.description,
      director: req.body.director,
      image: req.file ? req.file.filename : null
   });
   res.redirect('/');
};
