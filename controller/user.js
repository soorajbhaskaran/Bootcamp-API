const User = require('../models/User');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middleware/asyn');



//@desc Get all users
//@router /api/v1/user/admin/
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);

});


//@desc Get single user
//@router /api/v1/user/admin/:id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponce('User not found ', 404));
    }

    res.status(200).json({ success: true, data: user });
});

//@desc Create a user
//@router /api/v1/user/admin/
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    if (!user) {
        return next(new ErrorResponce('Error in creating the user ', 404));
    }

    res.status(200).json({ success: true, data: user });
});

//@desc Update a user
//@router /api/v1/user/admin/:id
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponce('Error in updating the user ', 404));
    }

    res.status(200).json({ success: true, data: user });
});

//@desc Create a user
//@router /api/v1/user/admin/
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!user) {
        return next(new ErrorResponce('Error in updating the user ', 404));
    }

    res.status(200).json({ success: true, data: user });
});

//@desc Delete a user
//@router /api/v1/user/admin/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
});