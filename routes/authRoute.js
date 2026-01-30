const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/verify", authController.verifyUser);
router.post("/changePassword", authController.changePassword);

 module.exports = router;
