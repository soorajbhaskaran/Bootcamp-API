const express = require('express');
const { register, loginUser } = require('../controller/auth');

//Initialising router
const router = express.Router();

router.route('/register').post(register);
router.post('/login', loginUser);

module.exports = router;