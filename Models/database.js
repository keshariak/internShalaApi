const mongoose= require("mongoose")
require("dotenv").config({path: "./.env"});

exports.connectDatabase = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database Connected...`)
        
    } catch (error) {
        console.log(error.message)
        
    }
}