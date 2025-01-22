const mongoose = require('mongoose');
const {Schema } = mongoose;

const bannerSchma = new Schema ({
    title:{
        type:String ,
        required:true,
        trim: true
    },
    image:{
        type:String ,
        required:true,
        trim: true
    }

})
module.exports = mongoose.model("banner" , bannerSchma);