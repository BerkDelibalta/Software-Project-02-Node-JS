const CustomError = require('../errors');
const { isTokenValid } = require('../utils/index');

const authenticateUser = async (err, req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid - no token provided');
    }

    try {
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role };
        next()
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid - token is invalid');
    }


    next()
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
                'Unauthorized access to this route'
            );
        }
        next();
    }
};

module.exports = { authenticateUser, authorizePermissions, };