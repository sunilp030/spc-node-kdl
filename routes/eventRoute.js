const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

router.get("/getEventList", eventController.getEventList);
router.post("/insertEvent", eventController.insertEvent);
router.get("/getEventDetails", eventController.getEventDetails);
router.post("/updateEvent", eventController.updateEvent);
router.get("/deleteEvent", eventController.deleteEvent);

 module.exports = router;