const nodemailer= require("nodemailer")
const ErrorHandler = require("./ErrorHandler");
const { text } = require("express");

exports.sendmail=(req,res,next,url)=>{
    const transport= nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        port:465,
        auth:{
            user:process.env.MAIL_EMAIL_ADDRESS,
            pass:process.env.MAIL_PASSWORD
        },
    });

    const mailOption={
        from:"Aryan Private Limited",
        to:req.body.email,
        subject:"Password Reset Link",
        // "text": "Do Not Share With Others",
        html:` <h1>Click link to Reset Your Password</h1>
        <a href="${url}">Password reset link</a>
        `
   };

   transport.sendMail(mailOption,(err,info)=>{
    if(err) return next(new ErrorHandler(err,500));
    console.log(info);
    return res.status(200).json({
        messge:"Mail sent Successfully...",
        url
    })
   })
}