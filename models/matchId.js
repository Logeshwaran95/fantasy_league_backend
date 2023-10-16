const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
});

const MatchId = mongoose.model('Matchid', matchSchema);
module.exports = MatchId;