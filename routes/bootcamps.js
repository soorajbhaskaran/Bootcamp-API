const express = require('express');

const { getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getSingleBootcamp, getBootcampFromRadius, addPhotoBootcamp } = require('../controller/bootcamps');

//Initializing  other routes resources
const courseRouter = require('./courses');

//Declaring advancedResults middleware
const advancedResults=require('../middleware/advancedResults');
const Bootcamp=require('../models/Bootcamp');

const router = express.Router();

//Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampFromRadius);
router.route('/:id/photo').put(addPhotoBootcamp);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamp).post(createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;