const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4005;

const app = express();

app.get('/', (req, res ) => {
    res.send("Home")
})

app.listen(PORT , console.log(`Server started in ${PORT} PORT `));