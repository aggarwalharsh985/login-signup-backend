const express = require("express");
const router = express.Router();

const {login , signup} = require("../controller/auth");
const { mid, isAdmin, isStudent } = require("../middleware/mid");


router.post("/login" , login);
router.post("/signup" , signup);

// testing route
router.get("/test" , mid , (req,res) => {
    res.json({
        success: true,
        message: "welcome to the protected route for testing"
    })
});

router.get("/student" , mid, isStudent, (req,res) => {
    res.json({
        success: true,
        message: "welcome to the prctected route for student"
    })
})
router.get("/admin", mid, isAdmin, (req,res) => {
    res.json({
        success: true,
        message: "welcome to the protected route for admin"
    })
})

module.exports = router;