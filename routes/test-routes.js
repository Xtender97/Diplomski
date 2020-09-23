const express = require('express');
const router = express.Router();

const bodyparser = require('body-parser');
const testController = require('../controllers/test-controller')

router.get('/getTest', testController.getTest );

module.exports = router;