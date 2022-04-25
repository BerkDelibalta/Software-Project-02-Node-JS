const User = require('../models/User');
const errors = require('../errors');
const http = require('http-status-codes');

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    if (!users) throw new errors.UserNotFound('No users found with user role');
    res.status(http.StatusCodes.OK).json({ users });
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, role: 'user' }).select('-password');
    if (!user) throw new errors.NotFoundError('User not found');
    res.status(http.StatusCodes.OK).json({ user });
}
const showCurrentUser = async (req, res) => {
    res.status(http.StatusCodes.OK).json({ message: 'Current user' });
}
const updateUser = async (req, res) => {
    res.status(http.StatusCodes.OK).json({ message: 'User updated' });
}
const updateUserPassword = async (req, res) => {
    res.status(http.StatusCodes.OK).json({ message: 'User password updated' });
}


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}