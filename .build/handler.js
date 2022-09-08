"use strict";
exports.__esModule = true;
var routes_1 = require("./src/main/routes");
var express = require('express');
var serverless = require("serverless-http");
var app = express();
app.use(express.json());
(0, routes_1.employeeRoutes)(app);
module.exports.handler = serverless(app);
