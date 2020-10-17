const Review = require('../models/Reviews');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');

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