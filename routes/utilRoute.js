const express = require("express");

const router = express.Router();

const utilController = require("../controllers/utilController");

router.get("/getFillList", utilController.getDropdownList);
router.get("/userManualDownload", utilController.userManualDownload);

 module.exports = router;