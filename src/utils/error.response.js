'use strict';
class ErrorResponse extends Error {
    constructor({
        message = 'Server Internal Error',
        status = 500,
        code = 500,
    }) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

module.exports = ErrorResponse;
