
const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const geocoder = require('../utils/geocoder');
const path = require('path');
const advancedResults = require('../middleware/advancedResults');

//@desc get all bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);


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

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id ${req.params.id}`, 404));
    }

    //Removing bootcamp especially for running remove middleware
    bootcamp.remove();

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
    console.log(lat);
    console.log(zipcode);
    //Calculate radius in radian
    //distance divided by radius of earth
    //Radius of earth 6378km
    const radius = distance / 6378;

    //finding bootcamps within specified range
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    //Sending status to client
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

});

//@desc update phot bootcamp
//@router /api/v1/bootcamp/:id/photo
//@access Private
exports.addPhotoBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponce(`Please add a file`, 400));
    }

    //Declare a fileUpload variable
    const doc = req.files.file;

    //Checking if the file is photo(Validation)
    if (!doc.mimetype.startsWith('image')) {
        return next(new ErrorResponce(`Please upload a image`, 400));
    }

    //Checking file upload size
    if (doc.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponce(`Cannot be uploaded file size is high`, 404));
    }

    //Creating custom file name
    doc.name = `photo_${bootcamp.id}${path.parse(doc.name).ext}`;

    doc.mv(`${process.env.FILE_UPLOAD_PATH}/${doc.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponce(`Unable to upload the file`, 404));

        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: doc.name });

        res.status(200).json({
            success: true,
            photo: doc.name
        })
    })


});
