const express = require("express");

const router = express.Router();

const mesController = require("../controllers/mesController");

router.get("/getMesDetails", mesController.getMesDetails);

 module.exports = router;
