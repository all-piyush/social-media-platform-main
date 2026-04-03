const mongoose=require('mongoose');
require('dotenv').config();
const dbconnect=()=>{
    mongoose.connect(process.env.Database_URL).
    then(()=>console.log("Database Connected Successfully")).
    catch((error)=>console.log(error));
}
module.exports=dbconnect;