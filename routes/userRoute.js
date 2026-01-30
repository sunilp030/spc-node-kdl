const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

router.post("/verify", userController.verifyUser);
router.get("/getUserList", userController.getUserList);
router.get("/getDefaultUser", userController.getDefaultUser);
router.get("/getUserDetails", userController.getUserDetails);
router.get("/deleteUser", userController.deleteUser);
router.post("/updateUser", userController.updateUser);
router.post("/insertUser", userController.insertUser);


 module.exports = router;