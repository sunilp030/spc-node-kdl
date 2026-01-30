const express = require("express");

const router = express.Router();

const machineController = require("../controllers/machineController");

router.get("/getMachineList", machineController.getMachineList);
router.post("/insertMachine", machineController.insertMachine);
router.get("/getMachineDetails", machineController.getMachineDetails);
router.post("/updateMachine", machineController.updateMachine);
router.get("/deleteMachine", machineController.deleteMachine);

 module.exports = router;