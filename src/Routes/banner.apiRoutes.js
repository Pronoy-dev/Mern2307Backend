const express = require('express');
const _ = express.Router();
const {createBanner ,getAllBanner} = require('../controller/banner.controller');
const {upload} = require('../middleware/multer.middleware')
_.route('/banner').post(upload.fields([{name:"image" , maxCount : 1}]),createBanner).get(getAllBanner)
module.exports = _;