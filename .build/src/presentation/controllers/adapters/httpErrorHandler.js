"use strict";
exports.__esModule = true;
exports.HttpErrorHandler = void 0;
var HttpErrorHandler = /** @class */ (function () {
    function HttpErrorHandler() {
    }
    HttpErrorHandler.handle = function (error) {
        var status;
        var message = error.message;
        switch (error.name) {
            case 'BadRequestError':
                status = 400;
                break;
            case 'NotFoundError':
                status = 404;
                break;
            default:
                status = 500;
        }
        return { status: status, body: { message: message } };
    };
    return HttpErrorHandler;
}());
exports.HttpErrorHandler = HttpErrorHandler;
