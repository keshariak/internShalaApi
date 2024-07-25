const express = require("express");
// const uploadfile= require("../uploads")
const { homepage,
     studentsignup,
     studentsignin,
     studentsignout, 
     currentUser,
     studentSendmail,
     studentforgetlink,
     studentresetpassword,
     studentupdate,
     studentavatar
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

// POST /student/signin
router.post("/student/signin", studentsignin)


// GET /student/signup
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




module.exports =router;