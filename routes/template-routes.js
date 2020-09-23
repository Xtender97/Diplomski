let express = require("express");
let router = express.Router();
const bodyparser = require('body-parser');

const templateController = require('../controllers/template-controller');
const authGuard = require('../guards/auth.guard');

router.use(authGuard);

router.post('/runCode', bodyparser.json(), templateController.runCode);

router.post('/analyzeCode', bodyparser.json(), templateController.analyzeCode);

router.post('/saveTemplate', bodyparser.json(), templateController.saveTemplate);

module.exports = router;
