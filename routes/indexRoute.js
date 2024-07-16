const express = require("express");
const { homepage, studentsignup,studentsignin,studentsignout, currentUser } = require("../controller/indexController");
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



module.exports =router;