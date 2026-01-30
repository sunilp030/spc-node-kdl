const express = require("express");

const router = express.Router();

const shiftController = require("../controllers/shiftController");

router.get("/getShiftList", shiftController.getShiftList);
router.post("/insertShift", shiftController.insertShift);
router.get("/getShiftDefaultDetails",shiftController.getShiftDefaultDetails);
router.get("/getShiftDetails",shiftController.getShiftDetails);
router.post("/updateShift", shiftController.updateShift);
router.get("/deleteShift", shiftController.deleteShift);

module.exports = router;
