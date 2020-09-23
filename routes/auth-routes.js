const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');

const authController = require('../controllers/auth-controller');

router.post('/register',bodyparser.json(), authController.register);
router.post('/login',bodyparser.json(), authController.login);


module.exports = router;
