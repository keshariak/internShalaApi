const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");



exports.resume = catchAsyncErrors(async (req, res,next)=>{
    const {resume}= await Student.findById(req.id).exec()
    res.json({message:"secure resume page!", resume})
}
)

exports.addeducation = catchAsyncErrors(async (req, res,next)=>{

    const student= await Student.findById(req.id).exec()
    student.resume.education.push(req.body)
    await student.save()
    
}
)