const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    inningsid: {
        type: Number,
        required: true,
        min: 0,
        max: 2
    }
});

const MatchId = mongoose.model('Matchid', matchSchema);
module.exports = MatchId;