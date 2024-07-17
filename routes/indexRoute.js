const express = require("express");
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
const router =express.Router()

// GET /
router.get("/", homepage);


// POST /
router.post("/student",isAuthenticated, currentUser);

// POST /student/signup
router.post("/student/signup", studentsignup)

// POST /student/signin
router.post("/student/signin", studentsignin)


// GET /student/signup
router.get("/student/signout", studentsignout)

// POST /student/forgetpassword
router.post("/student/forgetpassword", studentSendmail)


// GET /student/studentforgetlink/id
router.get("/student/forget-link/:id", studentforgetlink)

// PoST /student/reset-password/:id
router.post("/student/reset-password/:id",isAuthenticated, studentresetpassword)

// PoST /student/upadte/:id
router.post("/student/update/:id",isAuthenticated, studentupdate)

// POST /student/upadte/:id
router.post("/student/avatar/:id",isAuthenticated, studentavatar)







module.exports =router;