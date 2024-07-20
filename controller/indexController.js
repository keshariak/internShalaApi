
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/Nodemailer");
const { sendtoken } = require("../utils/SendToken");
const imagekit= require("../utils/imagekit").initImageKit()


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


// exports.studentavatar=catchAsyncErrors(async (req, res,next)=>{
//     const student = await Student.findById(req.params.id).exec();
//      // Handle the uploaded file
//      if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // const file = req.files.avatar;
//     // console.log(JSON.stringify(req.files))
     

// //     const modifiedFileName=`resumeBuilder-${Date.now()}${path.extname(file.name)}`

// //     if(student.avatar.fileId !== ""){
// //         await imagekit.deleteFile(student.avatar.fileId);
// //     }

// //     const {fileId, url}= await imagekit.upload({
// //         file: file.data,
// //         fileName:modifiedFileName,
// //     })
// //     // student.avatar.fileId= fileId;
// //     // student.avatar.url=url
// //     student.avatar= {fileId, url};
// //     await student.save()

// //     res.status(200).json({
// //         success:true,
// //        message:"Student Profile Updated"
// //    })
// //    sendtoken(student,201, res)
    
// })

