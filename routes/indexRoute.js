const express = require("express");
// const uploadfile= require("../uploads")
const { homepage,
     studentsignup,
     studentsignupgoogle,
     studentsignin,
     studentsigningoogle,
     setstudentPassword,
     studentsignout, 
     currentUser,
     studentSendmail,
     studentforgetlink,
     studentresetpassword,
     studentupdate,
     studentavatar,
     applyinternship,
     applyjob,
     internshipread,
     internshipreadsingle,
     jobreadsingle,
     jobread,
     } = require("../controller/indexController");
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
router.post("/student",isAuthenticated, currentUser);

// POST /student/signup
router.post("/student/signup", studentsignup)

// POST /student/signup with GOOGLE
router.post("/student/google/signup", studentsignupgoogle)


// POST /student/signin
router.post("/student/signin", studentsignin)

// POST /student/signin WITH GOOGLE
router.post("/student/google/signin", studentsigningoogle)



// Route for setting a new password
router.post('/student/set-password', setstudentPassword);


// GET /student/signOut
router.get("/student/signout",isAuthenticated, studentsignout)

// POST /student/forgetpassword
router.post("/student/forgetpassword", studentSendmail)


// GET /student/studentforgetlink/id
router.get("/student/forget-link/:id", studentforgetlink)

// PoST /student/reset-password/:id
router.post("/student/reset-password/:id",isAuthenticated, studentresetpassword)

// POST /student/upadte/:id
router.post("/student/update/:id",isAuthenticated, studentupdate)


// POST /student/avatar/:id
router.post("/student/avatar/:id", isAuthenticated, studentavatar);


//----applied internship--------------

// POST /student/apply/:internshipid
router.post("/student/apply/internship/:internshipid", isAuthenticated, applyinternship);

//----applied job--------------

// POST /student/apply/:jobid
router.post("/student/apply/job/:jobid", isAuthenticated, applyjob);


//POST /employee/internship/read
router.post("/student/internship/read", isAuthenticated, internshipread);


//POST /employee/internship/read/:id
router.post("/student/internship/read/:id", isAuthenticated, internshipreadsingle);

//POST /employee/job/read
router.post("/student/job/read", isAuthenticated, jobread);

//POST /employee/job/read/:id
router.post("/student/job/read/:id", isAuthenticated, jobreadsingle);


module.exports =router;