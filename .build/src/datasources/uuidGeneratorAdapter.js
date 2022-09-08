"use strict";
exports.__esModule = true;
exports.UuidGeneratorAdapter = void 0;
var uuid_1 = require("uuid");
var UuidGeneratorAdapter = /** @class */ (function () {
    function UuidGeneratorAdapter() {
    }
    UuidGeneratorAdapter.prototype.generate = function () {
        return (0, uuid_1.v4)();
    };
    return UuidGeneratorAdapter;
}());
exports.UuidGeneratorAdapter = UuidGeneratorAdapter;
