const Review = require('../models/Reviews');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const Bootcamp = require('../models/Bootcamp');

//@desc get all Reviews
//@router /api/v1/reviews
//@router /api/v1/bootcamp/bootcampId/reviews
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {

    //Checking for first condition if the route is through bootcamp and filtering
    if (req.params.bootcampId) {
        const review = await Review.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: review.length,
            data: review
        })
    }
    res.status(200).json(res.advancedResults);

});

//@desc get a single review
//@router /api/v1/reviews/:id
//@access Public

exports.getSingleReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp', select: "name description",
    });

    if (!review) {
        return next(new ErrorResponce(`Review with id ${req.params.id} is not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });


});

//@desc add a review
//@router /api/v1/bootcamp/:bootcampId/review
//@access Private

exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    //Checking bootcamp exists
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found`, 404));
    }

    const review = await Review.create(req.body);

    //CHeckimg review created
    if (!review) {
        return next(new ErrorResponce(`Review not added`, 404));
    }

    res.status(201).json({
        success: true, data: review
    })

});

//@desc Update a review
//@router /api/v1/review/:id
//@access Private

exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponce(`Review not found with id ${req.params.id}`, 404));
    }

    //Check the person has the authorization to access
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponce('Not authorized to access the review', 404));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: review })
});

//@desc Delete review
//@router /api/v1/review/:id
//@access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponce(`Review not found with id ${req.params.id}`, 404));
    }

    //Check the person has the authorization to access
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponce('Not authorized to access the review', 404));
    }

   await review.remove();

    res.status(200).json({ success: true, data: {} })
});