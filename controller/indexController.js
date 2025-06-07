
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Student = require("../Models/StudentModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/Nodemailer");
const { sendtoken } = require("../utils/SendToken");
var bcrypt = require('bcryptjs');

const Internship =require("../Models/InternshipModel")
const Job =require("../Models/jobModel")



exports.homepage = catchAsyncErrors(async (req, res,next)=>{
            res.json({message:"Secure Homepage"});
    }
)

// exports.currentUser = catchAsyncErrors(async (req, res,next)=>{
//     const student = await Student.findById(req.id).exec();
//     res.json({student})
// }
// )
exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.user.id).exec();
  res.json({ student });
});


exports.studentsignup=catchAsyncErrors(async (req, res,next)=>{
    const student= await new Student(req.body).save();
    // res.status(201).json(student)
    sendtoken(student,201, res)
    
})

exports.studentsignupgoogle=catchAsyncErrors(async (req, res,next)=>{
    const student= await new Student(req.body).save();
    // res.status(201).json(student)
    sendtoken(student,201, res)
    
})

// Set or update a student's password
exports.setstudentPassword = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received request:', { email, password }); // Debug log

    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();
  
      // Find the student by email
      const student = await Student.findOne({ email: normalizedEmail });
  
      if (!student) {
        console.log('Student not found for email:', email); // Debug log
        return res.status(404).json({ message: 'Student not found in backend' });
      }
  
      console.log('Student found:', student); // Debug log
  
      // Hash the new password
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the student's password in the database
      student.password = password;
      await student.save();
  
      console.log('Password updated successfully'); // Debug log
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error setting password:', error.message); // Improved error logging
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.studentsignin = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).select("+password").exec();

  if (!student) {
    return next(new ErrorHandler("User Not Found with this Email address", 404));
  }

  const isMatch = await student.comparepassword(req.body.password); // ✅ use await here

  if (!isMatch) {
    return next(new ErrorHandler("Wrong password", 500));
  }

  sendtoken(student, 200, res);
});



exports.studentsigningoogle=catchAsyncErrors(async (req, res,next)=>{
    const student= await Student.findOne({email:req.body.email}).exec();
    

    if(!student) return next(new ErrorHandler("User Not Found with this Email address", 404))

        // const isMatch= student.comparepassword(req.body.password);
        // if(!isMatch) return next(new ErrorHandler("Wrong password", 500))
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
exports.applyinternship = catchAsyncErrors(async (req, res, next) => {
    try {
      // Find student and internship
      const student = await Student.findById(req.id).exec();
      const internship = await Internship.findById(req.params.internshipid).exec();
      // Check if student is already applied to this internship
      if (student.internships.includes(internship._id)) {
        return res.status(400).json({ message: "You have already applied for this internship." });
      }
      // Check if internship has already been applied by the student
      if (internship.students.includes(student._id)) {
        return res.status(400).json({ message: "Application already exists for this internship." });
      }
      // Add internship to student's list and student to internship's list
      student.internships.push(internship._id);
      internship.students.push(student._id);
      // Save changes
      await student.save();
      await internship.save();
      // Respond with success message
      res.json({ message: "Successfully applied for the internship!" });
    } catch (error) {
      next(error); // Pass errors to error handling middleware
    }
  });
  

//----apply job--------------
exports.applyjob = catchAsyncErrors(async (req, res,next)=>{
    const student = await Student.findById(req.id).exec();
    const job = await Job.findById(req.params.jobid).exec();
    // Check if student is already applied to this internship
    if (student.jobs.includes(job._id)) {
        return res.status(400).json({ message: "You have already applied for this job." });
      }
      // Check if internship has already been applied by the student
      if (job.students.includes(student._id)) {
        return res.status(400).json({ message: "Application already exists for this job." });
      }


     // Add internship to student's list and student to internship's list
    student.jobs.push(job._id)
    job.students.push(student._id)



     // Save changes
    await student.save()
    await job.save()

    res.json("message: applied!!!!")
    
    
}
)
 //Read Intrenship
 exports.internshipread = catchAsyncErrors(async(req, res , next)=>{
    const internships =await Internship.find()
res.status(201).json({succes: true, internships})
})


exports.internshipreadsingle = catchAsyncErrors(async(req, res , next)=>{
    const internship =await Internship.findById(req.params.id)
res.status(201).json({succes: true, internship})
})


 //Read Jobs
 exports.jobread = catchAsyncErrors(async(req, res , next)=>{
    const jobs =await Job.find()
res.status(201).json({succes: true, jobs})
})


exports.jobreadsingle = catchAsyncErrors(async(req, res , next)=>{
    const job =await Job.findById(req.params.id)
res.status(201).json({succes: true, job})
})