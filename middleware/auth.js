const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyn');
const ErrorResponce = require('../utils/errorResponce');

exports.protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearers')) {

        token = req.headers.authorization.split(' ')[1];


    }
    //else if (req.cookies.token) {
    //    token=req.cookies.token
    //}

    //Make sure token exists
    if (!token) {
        return next(new ErrorResponce(`Not authorized to access the request`, 401));
    }

    //Verify the token 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponce(`Not get`, 401));
    }
})
