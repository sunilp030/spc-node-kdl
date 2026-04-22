
const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const chartController = require("../controllers/chartController");

const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.get("/getChartList", chartController.getChartList);
router.post("/insertChart", chartController.insertChart);
router.get("/getChartDetails",chartController.getChartDetails);
router.get("/getChartData",chartController.getChartData);
router.get("/exportsToExcel", exportLimiter, chartController.exportsToExcel);
router.post("/updateChart", chartController.updateChart);
router.get("/exportsToMes", exportLimiter, chartController.exportsToMes);

module.exports = router;