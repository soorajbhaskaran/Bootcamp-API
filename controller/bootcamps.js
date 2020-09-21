
const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const geocoder = require('../utils/geocoder');

//@desc get all bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    //Declaring a query variable
    let query;

    //Copying req.query
    reqQuery = { ...req.query };

    //Fields to execute
    const removeQuery = ['select', 'sort', 'limit', 'page'];

    //Removing query from the url
    removeQuery.forEach(param => delete reqQuery[param]);


    //Converting to query form
    let queryStr = JSON.stringify(reqQuery);

    //Including operator like gt,gte etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding the specified resource from the database
    query = Bootcamp.find(JSON.parse(queryStr));

    //Select operator finding 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        // console.log(fields)
        query = query.select(fields);
        //console.log(query);

    }

    //Sort function
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    //Adding skipping for showing number of entries from a page
    query = query.skip(startIndex).limit(limit);

    const pagination = {};

    //Pagination showing as request
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }

    //Executing the function from database
    const bootcamp = await query;
    res.status(200).json({ success: true, count: bootcamp.length, pagination, data: bootcamp });


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