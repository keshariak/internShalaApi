const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");


exports.homepage = catchAsyncErrors(async (req, res,next)=>{
            res.json({message:"Secure Homepage"});
    }
)

exports.currentUser = catchAsyncErrors(async (req, res,next)=>{
    const student = await Student.findById(req.id).exec();
    res.json({student})
}
)

exports.studentsignup=catchAsyncErrors(async (req, res,next)=>{
    const student= await new Student(req.body).save();
    // res.status(201).json(student)
    sendtoken(student,201, res)
    
})

exports.studentsignin=catchAsyncErrors(async (req, res,next)=>{
    const student= await Student.findOne({email:req.body.email}).select("+password").exec();
    

    if(!student) return next(new ErrorHandler("User Not Found with this Email address", 404))

        const isMatch= student.comparepassword(req.body.password);
        if(!isMatch) return next(new ErrorHandler("Wrong password", 500))
        // res.json(student)
        sendtoken(student,200, res)
})

exports.studentsignout=catchAsyncErrors(async (req, res,next)=>{
    res.clearCookie("token");
    res.json({message:"Successfully SignOut!!"})
   
})
