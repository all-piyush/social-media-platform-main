const express=require('express');
const cookieparser=require('cookie-parser');
const fileupload=require('express-fileupload');
const app=express();
const cors=require('cors');

require('dotenv').config();
app.use(express.json());
app.use(cookieparser());

app.use(cors({

  origin:['http://localhost:3000',"https://task-six-smoky-73.vercel.app"], 
  credentials: true,               
}));
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.get('/',(req,res)=>{
    res.send("hello");
})
const dbconnect=require('./config/database');
dbconnect();
const cloudinary=require('./config/Cloudinary');
cloudinary.cloudinaryConnect();
const routes=require('./Route/Routes');
app.use('/api/v1',routes);
app.listen(process.env.PORT||4000,(req,res)=>{
    console.log("Server Started");
})
