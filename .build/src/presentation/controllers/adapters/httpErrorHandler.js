"use strict";
exports.__esModule = true;
exports.HttpErrorHandler = void 0;
var errors_1 = require("../../../core/errors");
var HttpErrorHandler = /** @class */ (function () {
    function HttpErrorHandler() {
    }
    HttpErrorHandler.handle = function (error) {
        console.log('Error log', error);
        var status = 500;
        var message = error.message;
        if (error instanceof errors_1.BadRequestError) {
            status = 400;
        }
        if (error instanceof errors_1.NotFoundError) {
            status = 404;
        }
        if (error instanceof errors_1.ServerError) {
            status = 500;
        }
        return { status: status, body: { message: message } };
    };
    return HttpErrorHandler;
}());
exports.HttpErrorHandler = HttpErrorHandler;
