const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const dotenv = require('dotenv');
const  mongoose  = require('mongoose');
const cloudinary = require('cloudinary');
const fs = require('fs');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4005;

//cloudinary settings

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


//routerlani ulash
const userRouter = require('./src/router/userRouter')
const fallowRouter = require('./src/router/fallowRouter')
const postsRouter = require('./src/router/postsRouter');
const likesRouter = require('./src/router/likesRotuer');





//midlwares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({useTempFiles: true}))
app.use(cors())

app.get('/', (req, res ) => {
    res.send("Home")
    
})
//routerlani ishlatsh
app.use('/user',userRouter);
app.use('/fallow',fallowRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter)

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {}).then(() => {
    app.listen(PORT , console.log(`Server started in ${PORT} PORT `));
}).catch(err => {
    console.log(err);
})

