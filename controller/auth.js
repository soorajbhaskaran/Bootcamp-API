const User = require('../models/User');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');


//@desc Change user
//@router /api/v1/user
//@access Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    //Create a User
    const user = await User.create({ name, email, password, role });

    if (!user) {
        return next(new ErrorResponce(`Entered invalid entry`, 404));
    }
    sendbackCookie(200, res, user);


});

//@desc Login User
//@router /api/v1/user/login
//@access Private
exports.loginUser = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    //Checking basic validation for email and password
    if (!email || !password) {
        return next(new ErrorResponce('Please enter a email and a password :', 400));
    }

    //Checking for user in db
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponce('Invalid credientials', 401));
    }

    //Match passwords
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponce('Invalid credientials', 401));
    }
    sendbackCookie(200, res, user);

});


//@desc Current User
//@router /api/v1/user/me
//@access Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponce(`Some error has Occured`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
});

//Create a cookie from create user and login
const sendbackCookie = (statusCode, res, user) => {

    //Creating jwt web token
    const token = user.getJWTwebToken();

    const options = {
        expires: new Date(Date.now + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

}