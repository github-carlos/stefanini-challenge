import { employeeRoutes } from "./src/main/routes";
import { Express } from 'express';
const express = require('express')

const serverless = require("serverless-http");

const app: Express = express();
app.use(express.json());
employeeRoutes(app);

module.exports.handler = serverless(app)