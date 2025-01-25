const express = require("express");
const app = express();
const allRoutes = require("./src/Routes/index");
const cookieParser = require("cookie-parser");
const cors = require('cors')
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,

}))
app.use(express.json());
app.use(cookieParser());

// serve static file
app.use("/static/images", express.static("public/temp"));
app.use(allRoutes);

module.exports = { app };
