let express = require("express");
let router = express.Router();
const bodyparser = require('body-parser');

const templateController = require('../controllers/template-controller')

router.post('/runCode', bodyparser.json(), templateController.runCode);

router.post('/analyzeCode', bodyparser.json(), templateController.analyzeCode);

module.exports = router;
