const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config()
let router;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.globalConnection, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to mongodb"); 
    router = require("./routes/router");
    app.use("",router);
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
});
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit: '50mb'}));
app.use(morgan('dev'));
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://fantasyleague.cseaceg.org.in');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Success ! Server started listening on ${PORT}`);
});
