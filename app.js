require("dotenv").config({path: "./.env"});
const express = require("express");
const app = express()

//Db connetion
require("./Models/database").connectDatabase()

// logger
const logger = require("morgan");
app.use(logger("tiny"))

//bodyparser
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Session And Cookie
const session = require("express-session");
const cookieparser= require("cookie-parser");
 app.use(session({
    resave:true,
    saveUninitialized:true,
    secret: process.env.EXPRESS_SESSION_SECRET
 })
 );
 app.use(cookieparser())

//routes
app.use("/", require("./routes/indexRoute"));



 // Error Handling
 const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
app.all("*", (req,res,next)=>{
    next(new ErrorHandler(`Page Url not found ${req.url}`, 404))
})

app.use(generatedErrors)



app.listen(process.env.PORT, console.log(`server is running on ${process.env.PORT}`));