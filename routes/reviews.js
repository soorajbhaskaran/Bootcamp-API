const express = require('express');

const { getReviews, getSingleReview, addReview, updateReview, deleteReview } = require('../controller/reviews');

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
}), getReviews).post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getSingleReview)
.put(protect, authorize('admin', 'user'), updateReview)
.delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router;