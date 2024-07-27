const express = require("express");
// const uploadfile= require("../uploads")
const { homepage,
    employeesignup,
     employeesignin,
     employeesignout, 
     currentUser,
     employeeSendmail,
     employeeforgetlink,
     employeeresetpassword,
     employeeupdate,
     employeeavatar,

     internshipcreate,
     internshipread,
     internshipreadsingle,

     jobcreate,
     jobread,
     jobreadsingle,
     } = require("../controller/employeeController");
const { isAuthenticated } = require("../middlewares/auth");


const multer = require("multer");
const router = express.Router();

// Configure storage options
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
         cb(null, '../uploads'); // Specify the directory to save the uploaded files
     },
     filename: function (req, file, cb) {
         cb(null, Date.now() + '-' + file.originalname); // Specify the filename format
     }
 });
 
 const upload = multer({ storage });
// GET /
router.get("/", homepage);


// POST /
router.post("/employee-homepage",isAuthenticated, currentUser);


// POST /Employee/signup
router.post("/signup", employeesignup)


// POST /employee/signin
router.post("/signin", employeesignin)

// GET /employee/signup
router.get("/signout",isAuthenticated, employeesignout)



// POST /employee/forgetpassword
router.post("/forgetpassword", employeeSendmail)


// GET /employee/employeeforgetlink/id
router.get("/forget-link/:id", employeeforgetlink)

// PoST /employee/reset-password/:id
router.post("/reset-password/:id",isAuthenticated, employeeresetpassword)

// POST /employee/upadte/:id
router.post("/update/:id",isAuthenticated, employeeupdate)


//POST /employee/avatar/:id
router.post("/avatar/:id", isAuthenticated, employeeavatar);


//----------------------INTERNSHIP---------------------

//POST /employee/internship/create
router.post("/internship/create", isAuthenticated, internshipcreate);

//POST /employee/internship/read
router.post("/internship/read", isAuthenticated, internshipread);

//POST /employee/internship/read/:id
router.post("/internship/read/:id", isAuthenticated, internshipreadsingle);


//----------------------JOB---------------------

//POST /employee/job/create
router.post("/job/create", isAuthenticated, jobcreate);

//POST /employee/job/read
router.post("/job/read", isAuthenticated, jobread);

//POST /employee/job/read/:id
router.post("/job/read/:id", isAuthenticated, jobreadsingle);

module.exports =router;