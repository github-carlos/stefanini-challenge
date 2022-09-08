"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.NotFoundError = exports.ServerError = exports.BadRequestError = void 0;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message, name) {
        if (name === void 0) { name = 'BadRequestError'; }
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.name = name;
        return _this;
    }
    return BadRequestError;
}(Error));
exports.BadRequestError = BadRequestError;
var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.message = 'Internal Server Error';
        _this.name = 'ServerError';
        return _this;
    }
    return ServerError;
}(Error));
exports.ServerError = ServerError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, name) {
        if (name === void 0) { name = 'NotFoundError'; }
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.name = name;
        return _this;
    }
    return NotFoundError;
}(Error));
exports.NotFoundError = NotFoundError;
