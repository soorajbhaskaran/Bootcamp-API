const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controller/user');
const advancedResults = require('../middleware/advancedResults');

//Initialising router
const router = express.Router();


//Declaring protect middleware
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

//Declaring since all of them require admin access
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);


module.exports = router;