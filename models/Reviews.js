const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

//Person of user can only add one review
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to get the average rating
ReviewSchema.statics.getAverageReview = async function (bootcampId) {
    //console.log('Calculating average cost ...');
    const obj = await this.aggregate([{
        $match: { bootcamp: bootcampId }
    },
    {
        $group: {
            _id: '$bootcamp',
            averageRating: { $avg: '$rating' }
        }
    }]);
    //console.log(obj);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });
    } catch (error) {
        console.log(err);
    }
}

//Creating a middleware for average cost after adding to database
ReviewSchema.post('save', function () {
    this.constructor.getAverageReview(this.bootcamp);
});

//Creating middleware for average cost before removing
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageReview(this.bootcamp);
})


module.exports = mongoose.model('Review', ReviewSchema);