const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/authcontroller");
const usercontroller = require("../controllers/usercontroller");

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);
router.patch("/resetpassword", authcontroller.resetPassword);
router.patch("/update", authcontroller.protect, usercontroller.updateUser);

module.exports = router;
