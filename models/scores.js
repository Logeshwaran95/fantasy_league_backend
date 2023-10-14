const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoresSchema = new Schema({
    score: {
        type: Number,
        required: true
    },

    id: {
        type: Number,
        required: true
    },
}, {timestamps:true});

const Scores = mongoose.model('Scores', scoresSchema);
module.exports = Scores;