const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const utilController = require("../controllers/utilController");

const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

router.get("/getFillList", utilController.getDropdownList);
router.get("/userManualDownload", downloadLimiter, utilController.userManualDownload);

 module.exports = router;