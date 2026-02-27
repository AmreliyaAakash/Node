const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        releaseYear: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        director: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);