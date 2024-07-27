
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/Nodemailer");
const { sendtoken } = require("../utils/SendToken");
const imagekit= require("../utils/imagekit").initImageKit()

const Internship =require("../Models/InternshipModel")
const Job =require("../Models/jobModel")


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


exports.studentSendmail = catchAsyncErrors(async (req, res,next)=>{
    const student= await Student.findOne({email:req.body.email}).exec();
    

    if(!student) return next(new ErrorHandler("User Not Found with this Email address", 404))

    const url= `${req.protocol}://${req.get("host")}/student/forget-link/${student._id}`
    sendmail(req,res,next,url);

    student.resetPasswordToken="1";
    await student.save()

    res.json({student, url});
}
)

exports.studentforgetlink = catchAsyncErrors(async (req, res,next)=>{
    const student= await Student.findById(req.params.id).exec();
    

    if(!student) return next(new ErrorHandler("User Not Found with this Email address", 404))

    
    if(student.resetPasswordToken=="1"){
        student.resetPasswordToken="0"
        student.password= req.body.password;
        await student.save();

    }
    else{

        return next(new ErrorHandler("Invailid reset password link! please try again", 500))
    }
    
    res.status(200).json({
        message:"Password has been Changed Successfully!"
    })
    
}
)



exports.studentresetpassword = catchAsyncErrors(async (req, res,next)=>{
    const student= await Student.findById(req.id).exec();
    student.password= req.body.password;
    await student.save();
    sendtoken(student,201,res)
}
)

exports.studentupdate=catchAsyncErrors(async (req, res,next)=>{
    await Student.findByIdAndUpdate(req.params.id,req.body).exec();
    res.status(200).json({
         success:true,
        message:"Student Details Updated"
    })
    sendtoken(student,201, res)
    
})




const path = require('path'); // Ensure path module is imported

exports.studentavatar = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find the student by ID
        const student = await Student.findById(req.params.id).exec();

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Access the file from the request
        const file = req.files.avatar;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Generate a modified file name
        const modifiedFileName = `resumeBuilder-${Date.now()}${path.extname(file.name)}`;

        // If there is an existing file, delete it from ImageKit
        if (student.avatar && student.avatar.fileId) {
            await imagekit.deleteFile(student.avatar.fileId);
        }

        // Upload the new file to ImageKit
        const { fileId, url } = await imagekit.upload({
            file: file.data,
            fileName: modifiedFileName,
        });

        // Update the student's avatar information
        student.avatar = { fileId, url };

        // Save the updated student record
        await student.save();

        // Send a success response
        res.status(200).json({
            success: true,
            message: "Student Profile Updated",
            avatar: student.avatar, // Optionally include updated avatar info
        });

        // Optionally send a token if needed (move this above if response is not finalized)
        // sendtoken(student, 201, res);
    } catch (error) {
        return next(error);
    }
});

//----apply internship--------------
exports.applyinternship = catchAsyncErrors(async (req, res,next)=>{
    const student = await Student.findById(req.id).exec();
    const internship = await Internship.findById(req.params.internshipid).exec();
    student.internships.push(internship._id)
    internship.students.push(student._id)
    await student.save();
    await internship.save();
    res.json("message: applied!!!!")
})

//----apply job--------------
exports.applyjob = catchAsyncErrors(async (req, res,next)=>{
    const student = await Student.findById(req.id).exec();
    const job = await Job.findById(req.params.jobid).exec();
    student.jobs.push(job._id)
    job.students.push(student._id)
    await student.save()
    await job.save()

    res.json("message: applied!!!!")
    
    
}
)
