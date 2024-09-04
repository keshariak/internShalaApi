const { catchAsyncErrors } = require("../middlewares/catchAsyncError");
const { v4: uuidv4 } = require('uuid');


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");



exports.resume = catchAsyncErrors(async (req, res,next)=>{
    const {resume}= await Student.findById(req.id).exec()
    res.json({message:"secure resume page!", resume})
}
)

// exports.resumeedit = catchAsyncErrors(async (req, res,next)=>{
//     const student= await Student.findById(req.id).exec()
//     student.resume.push([req.body])
//     await student.save()
//     res.json({message:"resume updated", resume})
// }
// )

exports.resumeedit = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find the student by ID
        const student = await Student.findById(req.id).exec();

        // Check if resume is an object
        if (typeof student.resume !== 'object' || Array.isArray(student.resume)) {
            throw new Error("Resume field is not an object.");
        }

        // Validate and update specific fields within the resume object
        const { education, jobs, internships, responsibilities, courses, skills, accomplishments } = req.body;

        if (education) student.resume.education = education;
        if (jobs) student.resume.jobs = jobs;
        if (internships) student.resume.internships = internships;
        if (responsibilities) student.resume.responsibilities = responsibilities;
        if (courses) student.resume.courses = courses;
        if (skills) student.resume.skills = skills;
        if (accomplishments) student.resume.accomplishments = accomplishments;

        // Save the updated student document
        await student.save();

        // Send a success response
        res.json({ message: "Resume updated", resume: student.resume });
    } catch (error) {
        next(error); // Pass errors to the error handler
    }
});



exports.addeducation = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findById(req.id).exec();
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    student.resume.education.push({ ...req.body, id: uuidv4() });
    await student.save();
    res.json({ message: 'Education Added!', student });
});
exports.addskill = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findById(req.id).exec();
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    student.resume.skills.push({ ...req.body, id: uuidv4() });
    await student.save();
    res.json({ message: 'skill Added!', student });
});

exports.addresponsibility = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.findById(req.id).exec();
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    student.resume.responsibilities.push({ ...req.body, id: uuidv4() });
    await student.save();
    res.json({ message: 'responsibility Added!', student });
});


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