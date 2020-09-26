const express = require('express');
const advancedResults=require('../middleware/advancedResults');
const { register, loginUser, getMe } = require('../controller/auth');

//Initialising router
const router = express.Router();


//Declaring protect middleware
const { protect } = require('../middleware/auth');
const User = require('../models/User');


router.route('/register').post(protect, register);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;