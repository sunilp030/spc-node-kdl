const express = require("express");

const router = express.Router();

const templateController = require("../controllers/templateController");

router.get("/getTemplateList", templateController.getTemplateList);
router.post("/insertTemplate", templateController.insertTemplate);
router.get("/getTemplateDetails", templateController.getTemplateDetails);
router.post("/updateTemplate", templateController.updateTemplate);
router.get("/deleteTemplate", templateController.deleteTemplate);
router.post("/insertGauge", templateController.insertGauge);
router.get("/getGaugeSourceDetails", templateController.getGaugeSourceDetails);
router.get("/deleteGaugeSource", templateController.deleteGaugeSource);
router.post("/updateGauge", templateController.updateGauge);
router.get("/getImageConfig", templateController.getImageConfig);
router.get("/getGoldenRuleList", templateController.getGoldenRuleList);


module.exports = router;
