//@desc get all bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).send({ success: 'true', msg: "get a bootcamp" })
};

//@desc get single bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getSingleBootcamp = (req, res, next) => {
    res.status(200).send({ success: 'true', msg: `get a singlebootcamp ${req.params.id}` });
};

//@desc post bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).send({ success: 'true', msg: "post a bootcamp" })
};

//@desc update bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).send({ success: 'true', msg: `update a bootcamp ${req.params.id}` });
};

//@desc delete bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).send({ success: 'true', msg: `delete a bootcamp ${req.params.id}` });
};