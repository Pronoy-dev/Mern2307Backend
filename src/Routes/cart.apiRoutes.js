const express = require('express');
const _ = express.Router()
const {addtocart} = require('../controller/cart.controller')
_.route('/addtocart').post(addtocart)
module.exports = _;