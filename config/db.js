const mongoose = require('mongoose');
require('dotenv').config();

const localUrl = process.env.MONGO_URL;

mongoose.connect(localUrl).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
    console.log("Error", err);
})


db = mongoose.connection;

module.exports = db;