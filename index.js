const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const  mongoose  = require('mongoose');
dotenv.config();

const PORT = process.env.PORT || 4005;

const app = express();

app.get('/', (req, res ) => {
    res.send("Home")
    
})

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {}).then(() => {
    app.listen(PORT , console.log(`Server started in ${PORT} PORT `));
}).catch(err => {
    console.log(err);
})

