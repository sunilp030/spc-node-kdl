const express = require("express");

const router = express.Router();

const backupController = require("../controllers/backupController");

router.get("/getBackupDetails", backupController.getBackupDetails);

 module.exports = router;
