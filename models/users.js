const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phno: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, {timestamps:true});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;