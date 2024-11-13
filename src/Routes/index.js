const express = require('express');
const _ = express.Router();

_.get('/ap1/v1/sh', (req, res) => {
    res.end("hikj")
})

_.get("/hi", (req, res) => {
    res.send("Kksd")
})
module.exports = _