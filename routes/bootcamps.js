const express = require('express');

const { getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getSingleBootcamp, getBootcampFromRadius, addPhotoBootcamp } = require('../controller/bootcamps');

//Initializing  other routes resources
const courseRouter = require('./courses');

//Declaring advancedResults middleware
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

//Declaring protect middleware
const { protect } = require('../middleware/auth');

const router = express.Router();

//Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampFromRadius);
router.route('/:id/photo').put(protect, addPhotoBootcamp);
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamp).post(protect, createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);

module.exports = router;