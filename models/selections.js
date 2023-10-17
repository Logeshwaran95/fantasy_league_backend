const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const playerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    team:{
        type: String,
        required: true
    },
    playerRole: {
        type: String,
        required: true
    }
})
const selectionsSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    mid: {
        type: String,
        required: true
    },
    selection: {
        type: [playerSchema],
        required: true
    }
}, {timestamps:true});
const allPlayerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    team:{
        type: String,
        required: true
    },
    cricbuzzId:{
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
},{timestamps:true})
const Selections = mongoose.model('Selections', selectionsSchema);
const PlayerList = mongoose.model('Players', allPlayerSchema);
module.exports = {Selections,PlayerList};