const express = require("express");

const router = express.Router();

const modifyController = require("../controllers/modifyController");

router.get("/getModifyList", modifyController.getModifyList);
router.get("/getModifyDetails", modifyController.getModifyDetails);
router.post("/updateModify", modifyController.updateModify);

 module.exports = router;