const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { v4: uuidv4 } = require('uuid');


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");



exports.resume = catchAsyncErrors(async (req, res,next)=>{
    const {resume}= await Student.findById(req.id).exec()
    res.json({message:"secure resume page!", resume})
}
)

exports.addeducation = catchAsyncErrors(async (req, res,next)=>{

    const student= await Student.findById(req.id).exec()
    student.resume.education.push({...req.body, id: uuidv4()})
    await student.save()
    res.json({message: "Education Added!", student}) 

})

exports.editeducation = catchAsyncErrors(async (req, res,next)=>{

    const student= await Student.findById(req.id).exec()
    const eduIndex = student.resume.education.findIndex(
        (i)=>i.id === req.params.eduid
    );
    student.resume.education[eduIndex]={
        ...student.resume.education[eduIndex],
        ...req.body
    }
    await student.save()
    res.json({message: "Education Updated!"}) 

})


exports.deleteeducation = catchAsyncErrors(async (req, res,next)=>{

    const student= await Student.findById(req.id).exec()
    const edufilteredu = student.resume.education.filter(
        (i)=>i.id !== req.params.eduid
    );
    student.resume.education=edufilteredu;
    await student.save()
    res.json({message: "Education Deleted!"}) 

})