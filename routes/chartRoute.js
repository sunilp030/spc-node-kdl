
const express = require('express');

const router = express.Router();

const chartController = require("../controllers/chartController");

router.get("/getChartList", chartController.getChartList);
router.post("/insertChart", chartController.insertChart);
router.get("/getChartDetails",chartController.getChartDetails);
router.get("/getChartData",chartController.getChartData);
router.get("/exportsToExcel",chartController.exportsToExcel);
router.post("/updateChart", chartController.updateChart);
router.get("/exportsToMes",chartController.exportsToMes);

module.exports = router;