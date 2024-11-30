const express = require("express");
const app = express();
const allRoutes = require("./src/Routes/index");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

// serve static file
app.use("/static/images", express.static("public/temp"));
app.use(allRoutes);

module.exports = { app };
