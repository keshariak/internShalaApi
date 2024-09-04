
const { catchAsyncErrors } = require("../middlewares/catchAsyncError");


const Employee = require("../Models/EmployeeModel");
const Internship = require("../Models/InternshipModel")
const Job = require("../Models/jobModel");
const Student = require("../Models/StudentModel");

const ErrorHandler = require("../utils/ErrorHandler");
const { sendmail } = require("../utils/Nodemailer");
const { sendtoken } = require("../utils/SendToken");
const imagekit = require("../utils/imagekit").initImageKit()


exports.homepage = catchAsyncErrors(async (req, res,next)=>{
            res.json({message:"Secure Employee Homepage"});
    }
)

exports.currentUser = catchAsyncErrors(async (req, res,next)=>{
    const employee = await Employee.findById(req.id).exec();
    res.json({employee})
}
)

exports.employeesignup=catchAsyncErrors(async (req, res,next)=>{
    const employee= await new Employee(req.body).save();
    sendtoken(employee,201, res)
    res.json(employee)
    
})
exports.employeesignupgoogle=catchAsyncErrors(async (req, res,next)=>{
    const employee= await new Employee(req.body).save();
    // res.status(201).json(student)
    sendtoken(employee,201, res)
    
})


exports.employeesignin=catchAsyncErrors(async (req, res,next)=>{
    const employee= await Employee.findOne({email:req.body.email}).select("+password").exec();
    

    if(!employee) return next(new ErrorHandler("User Not Found with this Email address", 404))

        const isMatch= employee.comparepassword(req.body.password);
        if(!isMatch) return next(new ErrorHandler("Wrong password", 500))
        // res.json(employee)
        sendtoken(employee,200, res)
})
exports.employeesigningoogle=catchAsyncErrors(async (req, res,next)=>{
    const employee= await Employee.findOne({email:req.body.email}).exec();
    

    if(!employee) return next(new ErrorHandler("User Not Found with this Email address", 404))

        // const isMatch= student.comparepassword(req.body.password);
        // if(!isMatch) return next(new ErrorHandler("Wrong password", 500))
        // res.json(student)
        sendtoken(employee,200, res)
})

exports.setemployeePassword = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received request:', { email, password }); // Debug log

    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();
  
      // Find the student by email
      const employee = await Employee.findOne({ email: normalizedEmail });
  
      if (!employee) {
        console.log('Student not found for email:', email); // Debug log
        return res.status(404).json({ message: 'employee not found in backend' });
      }
  
      console.log('employee found:', employee); // Debug log
  
      // Hash the new password
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the student's password in the database
      employee.password = password;
      await employee.save();
  
      console.log('Password updated successfully'); // Debug log
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error setting password:', error.message); // Improved error logging
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.employeesignout=catchAsyncErrors(async (req, res,next)=>{
    res.clearCookie("token");
    res.json({message:"Successfully SignOut!!"})
   
})


exports.employeeSendmail = catchAsyncErrors(async (req, res,next)=>{
    const employee= await Employee.findOne({email:req.body.email}).exec();
    

    if(!employee) return next(new ErrorHandler("User Not Found with this Email address", 404))

    const url= `${req.protocol}://${req.get("host")}/employee/forget-link/${employee._id}`
    sendmail(req,res,next,url);

    employee.resetPasswordToken="1";
    await employee.save()

    res.json({employee, url});
}
)

exports.employeeforgetlink = catchAsyncErrors(async (req, res,next)=>{
    const employee= await Employee.findById(req.params.id).exec();
    

    if(!employee) return next(new ErrorHandler("User Not Found with this Email address", 404))

    
    if(employee.resetPasswordToken=="1"){
        employee.resetPasswordToken="0"
        employee.password= req.body.password;
        await employee.save();

    }
    else{

        return next(new ErrorHandler("Invailid reset password link! please try again", 500))
    }
    
    res.status(200).json({
        message:"Password has been Changed Successfully!"
    })
    
}
)



exports.employeeresetpassword = catchAsyncErrors(async (req, res,next)=>{
    const employee= await Employee.findById(req.id).exec();
    employee.password= req.body.password;
    await employee.save();
    sendtoken(employee,201,res)
}
)



exports.employeeupdate=catchAsyncErrors(async (req, res,next)=>{
    await Employee.findByIdAndUpdate(req.params.id,req.body).exec();
    res.status(200).json({
         success:true,
        message:"employee Details Updated"
    })
    sendtoken(employee,201, res)
    
})


const path = require('path'); // Ensure path module is imported


exports.employeeavatar = catchAsyncErrors(async (req, res, next) => {
    try {
        // Find the employee by ID
        const employee = await Employee.findById(req.params.id).exec();

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Access the file from the request
        const file = req.files.organizationlogo;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Generate a modified file name
        const modifiedFileName = `resumeBuilder-${Date.now()}${path.extname(file.name)}`;

        // If there is an existing file, delete it from ImageKit
        if (employee.organizationlogo && employee.organizationlogo.fileId) {
            await imagekit.deleteFile(employee.organizationlogo.fileId);
        }

        // Upload the new file to ImageKit
        const { fileId, url } = await imagekit.upload({
            file: file.data,
            fileName: modifiedFileName,
        });

        // Update the employee's organization logo information
        employee.organizationlogo = { fileId, url };

        // Save the updated employee record
        await employee.save();

        // Send a success response
        res.status(200).json({
            success: true,
            message: "Employee Profile Updated",
            organizationlogo: employee.organizationlogo, // Optionally include updated logo info
        });

        // Optionally send a token if needed
        // sendtoken(employee, 201, res);
    } catch (error) {
        return next(error);
    }
});


//------------------------INTERNSHIP-----------------------

//creare
exports.internshipcreate = catchAsyncErrors(async(req, res , next)=>{
    const internship =await new Internship(req.body).save();
    const employee = await Employee.findById(req.id).exec();
    employee.internships.push(internship._id)
    internship.employee= employee._id
    await internship.save()
    await employee.save()
res.status(201).json({succes: true, internship})
})

 //Read
exports.internshipread = catchAsyncErrors(async(req, res , next)=>{
    const internships =await Internship.find()
res.status(201).json({succes: true, internships})
})


exports.internshipreadsingle = catchAsyncErrors(async(req, res , next)=>{
    const internship =await Internship.findById(req.params.id)
res.status(201).json({succes: true, internship})
})



//------------------------JOBS-----------------------

//creare
exports.jobcreate = catchAsyncErrors(async(req, res , next)=>{
    const job =await new Job(req.body).save();
    const employee = await Employee.findById(req.id).exec();
    employee.jobs.push(job._id)
    job.employee= employee._id
    await job.save()
    await employee.save()
res.status(201).json({succes: true, job})
})

 //Read
exports.jobread = catchAsyncErrors(async(req, res , next)=>{
    const jobs =await Job.find()
res.status(201).json({succes: true, jobs})
})


exports.jobreadsingle = catchAsyncErrors(async(req, res , next)=>{
    const job =await Job.findById(req.params.id)
res.status(201).json({succes: true, job})
})

// find All Students using student model
exports.allstudents = catchAsyncErrors(async(req, res , next)=>{
    const students =await Student.find()
res.status(201).json({succes: true, students})
})





