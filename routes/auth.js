const express = require('express');
const advancedResults = require('../middleware/advancedResults');
const { register, loginUser, getMe } = require('../controller/auth');

//Initialising router
const router = express.Router();


//Declaring protect middleware
const { protect } = require('../middleware/auth');



router.route('/register').post( register);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;