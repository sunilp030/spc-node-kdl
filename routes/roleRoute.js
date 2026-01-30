const express = require("express");

const router = express.Router();

const roleController = require("../controllers/roleController");

router.get("/getRoleList", roleController.getRollList);
router.get("/getDefaultRole", roleController.getDefaultRole);
router.post("/insertRole", roleController.insertRole);
router.get("/getRoleDetails", roleController.getRoleDetails);
router.get("/deleteRole", roleController.deleteRole);
router.post("/updateRole", roleController.updatetRole);

module.exports = router;
