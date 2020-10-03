const express = require('express');

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controller/courses');

const router = express.Router({ mergeParams: true });

//Declaring advancedResults
const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');


//Declaring protect middleware
const { protect, authorize } = require('../middleware/auth');

//Getting Courses
router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protect, authorize('admin', 'publisher'), addCourse);

router.route('/:id').get(getCourse).put(protect, authorize('admin', 'publisher'), updateCourse).delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;