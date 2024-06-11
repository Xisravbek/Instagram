const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const dotenv = require('dotenv');
const  mongoose  = require('mongoose');
dotenv.config();
const app = express();

const PORT = process.env.PORT || 4005;
//routerlani ulash
const userRouter = require('./src/router/userRouter')


//midlwares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload())
app.use(cors())

app.get('/', (req, res ) => {
    res.send("Home")
    
})
//routerlani ishlatsh
app.use('/user',userRouter)

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {}).then(() => {
    app.listen(PORT , console.log(`Server started in ${PORT} PORT `));
}).catch(err => {
    console.log(err);
})

