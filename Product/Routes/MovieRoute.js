const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');
const upload = require('../Middleware/uploadMiddleware'); // Assuming this still exists

router.get('/', movieController.getAllMovies);

router.get('/create', movieController.createPage);
router.post('/create', upload.single('image'), movieController.createMovie);

module.exports = router;
