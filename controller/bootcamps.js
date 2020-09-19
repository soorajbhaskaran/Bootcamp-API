
const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const geocoder = require('../utils/geocoder');

//@desc get all bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {


    const bootcamp = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp })


});

//@desc get single bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id ${req.params.id}`, 404));
    }

});

//@desc post bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp });


});

//@desc update bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: 'true', data: bootcamp });

});

//@desc delete bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({ success: 'true', data: {} });

});

//@desc get bootcamps within a radius in a zipcode
//@router /api/v1/bootcamp/radius/:zipcode/:distance
//@access Private
exports.getBootcampFromRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //get lattitude/longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calculate radius in radian
    //distance divided by radius of earth
    //Radius of earth 6378km
    const radius = await Bootcamp.create({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    //Sending status to client
    res.status(200).json({
        success: false,
        count: bootcamp.length,
        data: bootcamp
    })

});