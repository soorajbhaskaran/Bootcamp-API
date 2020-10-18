const express = require('express');
const { register, loginUser, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logoutUser } = require('../controller/auth');

//Initialising router
const router = express.Router();


//Declaring protect middleware
const { protect } = require('../middleware/auth');



router.route('/register').post(register);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.put('/updatepassword', protect, updatePassword);


module.exports = router;