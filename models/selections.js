const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const selectionsSchema = new Schema({
    selection: {
        type: Array,
        required: true
    },

    id: {
        type: Number,
        required: true
    },
}, {timestamps:true});

const Selections = mongoose.model('Selections', selectionsSchema);
module.exports = Selections;