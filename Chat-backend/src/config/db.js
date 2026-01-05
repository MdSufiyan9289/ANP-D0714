const mongoose=require("mongoose");
require("dotenv").config();
const databaseConnection=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to database successfully")
    })
    .catch((error)=>{
        console.log(error)
    })
}
module.exports=databaseConnection