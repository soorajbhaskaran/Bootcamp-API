const express = require('express');

const { getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getSingleBootcamp, getBootcampFromRadius } = require('../controller/bootcamps');

//Initializing  other routes resources
const courseRouter=require('./courses');

const router = express.Router();

//Re-route to other resources
router.use('/:bootcampId/courses',courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampFromRadius);
router.route('/').get(getBootcamp).post(createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;