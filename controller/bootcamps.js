const Bootcamp = require('../models/Bootcamp');

//@desc get all bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getBootcamp = async (req, res, next) => {
    try {

        const bootcamp = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp })

    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@desc get single bootcamps
//@router /api/v1/bootcamp
//@access Public
exports.getSingleBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@desc post bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success: true, data: bootcamp });
    } catch (error) {
        res.status(401).send({ success: false })
    }

};

//@desc update bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bootcamp) {
            return res.status(401).json({ success: false });
        }
        res.status(200).send({ success: 'true', data: bootcamp });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@desc delete bootcamps
//@router /api/v1/bootcamp
//@access Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(401).json({ success: false });
        }
        res.status(200).send({ success: 'true', data: {} });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};