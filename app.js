const express = require('express');
const app = express();
const allRoutes = require("./src/Routes/index");

app.use(allRoutes)

module.exports = { app }