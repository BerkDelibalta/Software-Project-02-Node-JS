const User = require('../models/User');
const errors = require('../errors');
const http = require('http-status-codes');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user)
    const users = await User.find({ role: 'user' }).select('-password');
    if (!users) throw new errors.UserNotFound('No users found with user role');
    res.status(http.StatusCodes.OK).json({ users });
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, role: 'user' }).select('-password');
    if (!user) throw new errors.NotFoundError('User not found');
    checkPermissions(req.user, req.user._id);
    res.status(http.StatusCodes.OK).json({ user });
}
const showCurrentUser = async (req, res) => {
    res.status(http.StatusCodes.OK).json({ user: req.user });
}


const updateUser = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new errors.BadRequestError('Enter both credentials');
    }

    const user = User.findOne({ _id: req.user.userId });

    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(http.StatusCodes.OK).json({ message: 'User updated' });
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new errors.BadRequestError('Both old and new password must be provided');
    }


    const user = await User.findOne({ _id: req.body.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
        throw new errors.UnauthenticatedError('Invalid credentials');
    }

    user.password = newPassword;
    await user.save();

    res.status(http.StatusCodes.OK).json({ message: 'User password updated' });
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}


