const express = require("express");
const router = express.Router();

const { resume,addeducation } = require("../controller/resumeController");
const { isAuthenticated } = require("../middlewares/auth");




router.get("/", isAuthenticated, resume);

// POST
router.post("/add-edu", isAuthenticated, addeducation)



module.exports =router;