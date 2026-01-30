const express = require("express");

const router = express.Router();

const managementController = require("../controllers/managementController");

router.get("/getManagementList", managementController.getManagementList);
router.get("/getManagementDetails", managementController.getManagementDetails);
router.post("/deleteManagement", managementController.deleteManagement);

 module.exports = router;
