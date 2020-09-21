const Course = require('../models/Course');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const Bootcamp = require('../models/Bootcamp');

//@desc get all Courses
//@router /api/v1/courses
//@router /api/v1/bootcamp/bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    //Checking for first condition if the route is through bootcamp
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find();
    }

    //Loading from the database
    const courses = await query.populate({
        path: 'bootcamp',
        select: 'name description'
    });

    //Sending responce to client
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
});

//@desc get SIngle Courses
//@router GET /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async (req, res, next) => {


    //Loading from the database
    const courses = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!courses) {
        return next(new ErrorResponce(`Course with course id  ${req.params.id} not found`, 404));
    }

    //Sending responce to client
    res.status(200).json({
        success: true,
        data: courses
    })
});

//@desc  Add new Course
//@router POST /api/v1/bootcamp/bootcampId/courses
//@access Private

exports.addCourse = asyncHandler(async (req, res, next) => {

    //Adding bootcampId to the new course added
    req.body.bootcamp = req.params.bootcampId

    //Finding the specified bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp with id  ${req.params.bootcampId} not found`, 404));
    }

    //Creating the course
    const courses = await Course.create(req.body);

    //Sending responce to client
    res.status(200).json({
        success: true,
        data: courses
    })
});

//@desc  Update new Course
//@router PUT /api/v1/courses/:id
//@access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {


    let courses = await Course.findById(req.params.id);

    if (!courses) {
        return next(new ErrorResponce(`Course with id  ${req.params.bootcampId} not found`, 404));
    }

    //Updating the course
    courses = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true});

    //Sending responce to client
    res.status(200).json({
        success: true,
        data: courses
    })
});


//@desc  Delete new Course
//@router DELETE /api/v1/courses/:id
//@access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {


    const courses = await Course.findById(req.params.id);

    if (!courses) {
        return next(new ErrorResponce(`Course with id  ${req.params.bootcampId} not found`, 404));
    }

    //Deleting the course
    await courses.remove();

    //Sending responce to client
    res.status(200).json({
        success: true,
        data: {}
    })
});


