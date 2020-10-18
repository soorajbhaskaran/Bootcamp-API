const User = require('../models/User');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


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

//@desc Current User
//@router /api/v1/user/me
//@access Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} })
});

//@desc Forgot password
//@router /api/v1/user/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    //Checking reset password option
    if (!user) {
        return next(new ErrorResponce('There is no account with this email', 401));
    }

    //Reset Password Option
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/user/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));



    }
});

//@desc Reset new password
//@router /api/v1/user/resetPassword/:resetpasswordToken
//@access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    //Hash the reset token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new ErrorResponce('Not FOund', 404));
    }

    //Create a new password
    user.password = req.body.password,
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined
    await user.save();


    sendbackCookie(200, res, user);

});

//@desc Update Details
//@router /api/v1/user/updatedetails
//@access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    let updateContent = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateContent, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponce(`Some error has Occured`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
});

//@desc Update Password
//@router /api/v1/user/updatepassword
//@access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //Checking the match password
    if ((!await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponce('Password Matching Failed', 402))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendbackCookie(200, res, user);
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