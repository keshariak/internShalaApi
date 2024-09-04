require("dotenv").config({path: "./.env"});
const express = require("express");
const app = express()
 const cors= require("cors")

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

// file uploader
 const fileupload= require("express-fileupload")
 app.use(fileupload())



 app.use(
    cors({
        origin:"https://nauktilok-frontend-react.vercel.app",
    credentials:true,
   })
 )

//routes
app.use("/user", require("./routes/indexRoute"));
app.use("/resume", require("./routes/resumeRoute"));
// app.use("/resume", require("./routes/resumeRoute"));
app.use("/employee", require("./routes/employeeRoute"));
app.get("/", function(req, res, next){
    res.send("Hello, Api is running!!!!!")

})




 // Error Handling
 const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
app.all("*", (req,res,next)=>{
    next(new ErrorHandler(`Page Url not found ${req.url}`, 404))
})

app.use(generatedErrors)



app.listen(process.env.PORT, console.log(`server is running on ${process.env.PORT}`));