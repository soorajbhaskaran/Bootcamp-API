const express = require('express');

const { getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getSingleBootcamp, getBootcampFromRadius, addPhotoBootcamp } = require('../controller/bootcamps');

//Initializing  other routes resources
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

//Declaring advancedResults middleware
const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

//Declaring protect middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

//Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampFromRadius);
router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), addPhotoBootcamp);
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamp).post(protect, authorize('admin', 'publisher'), createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(protect, authorize('admin', 'publisher'), updateBootcamp).delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

module.exports = router;