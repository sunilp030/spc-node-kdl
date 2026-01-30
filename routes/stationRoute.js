const express = require("express");

const router = express.Router();

const stationController = require("../controllers/stationController");

router.get("/getStationList", stationController.getSpcStationList);
router.post("/insertStation", stationController.insertSpcStation);
router.get("/getStationDetails", stationController.getSpcStationDetails);
router.post("/updateStation", stationController.updateSpcStation);
router.get("/deleteStation", stationController.deleteSpcStation);

 module.exports = router;