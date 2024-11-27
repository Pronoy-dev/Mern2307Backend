const express = require("express");
const app = express();
const allRoutes = require("./src/Routes/index");
const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser())
app.use(allRoutes);

module.exports = { app };
