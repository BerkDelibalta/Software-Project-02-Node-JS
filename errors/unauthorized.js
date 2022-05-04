const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./custom-api');

class UnauthorizedError extends CustomApiError {
    constructor(message) {
        super(message);
        this.StatusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizedError;