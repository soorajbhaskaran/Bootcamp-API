const express = require('express');

const { getReviews, getSingleReview } = require('../controller/reviews');

const router = express.Router({ mergeParams: true });

//Declaring advancedResults
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/Reviews');


//Declaring protect middleware
const { protect, authorize } = require('../middleware/auth');

//Getting all reviews
router.route('/').get(advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description'
}), getReviews);

router.route('/:id').get(getSingleReview);

module.exports = router;