const express = require("express");
const router = express.Router();

const { resume,addeducation,editeducation, addskill,deleteeducation,resumeedit,addresponsibility } = require("../controller/resumeController");
const { isAuthenticated } = require("../middlewares/auth");




router.get("/", isAuthenticated, resume);

router.post("/edit", isAuthenticated, resumeedit);

// POST
router.post("/add-edu", isAuthenticated, addeducation)
// POST
router.post("/add-skill", isAuthenticated, addskill)
// POST
router.post("/add-responsibility", isAuthenticated, addresponsibility)



// POST
router.post("/edit-edu/:eduid", isAuthenticated, editeducation)

// POST
router.post("/delete-edu/:eduid", isAuthenticated, deleteeducation)



module.exports =router;