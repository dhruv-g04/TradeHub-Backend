const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Product = new Schema({    
    owner:String,
    contact:Number,
    address:String,
    pincode:Number,
    category:String,
    model:String,
    price:Number,
    description:String,
    imageFilePath: String
}); 

// Product.plugin(passportLocalMongoose);

module.exports = mongoose.model('Product', Product);