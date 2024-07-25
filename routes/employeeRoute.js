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
     employeeavatar
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




module.exports =router;