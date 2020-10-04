const Course = require('../models/Course');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const Bootcamp = require('../models/Bootcamp');


//@desc get all Courses
//@router /api/v1/courses
//@router /api/v1/bootcamp/bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {

    //Checking for first condition if the route is through bootcamp and filtering
    if (req.params.bootcampId) {
        const course = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: course.length,
            data: course
        })
    }
    res.status(200).json(res.advancedResults);

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
    req.body.user = req.user.id;

    //Finding the specified bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp with id  ${req.params.bootcampId} not found`, 404));
    }


    //Check if the person owns the bootcamp for creating the course
    if (bootcamp.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponce(`User with id ${req.user.id} is not authorized to create course in ${bootcamp._id}`))

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


    const courses = await Course.findById(req.params.id);

    if (!courses) {
        return next(new ErrorResponce(`Course with id  ${req.params.id} not found`, 404));
    }

    //Check if the person owns the bootcamp for creating the course
    if (course.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponce(`User with id ${req.user.id} is not authorized to update course in ${course._id}`))

    }

    //Updating the course
    courses = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

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

    //Check if the person owns the course for deleting the course
    if (course.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponce(`User with id ${req.user.id} is not authorized to update course in ${course._id}`))

    }

    //Deleting the course
    await courses.remove();

    //Sending responce to client
    res.status(200).json({
        success: true,
        data: {}
    })
});




