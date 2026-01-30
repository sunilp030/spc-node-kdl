const express = require("express");

const router = express.Router();

const operationController = require("../controllers/operationalController");

router.get("/getOperationList", operationController.getOperationList);
router.post("/insertOperation", operationController.insertOperation);
router.get("/getOperationDetails", operationController.getOperationDetails);
router.post("/updateOperation", operationController.updateOperation);
router.get("/deleteOperation", operationController.deleteOperation);


 module.exports = router;