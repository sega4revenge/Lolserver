'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const championSchema = mongoose.Schema({
    id             : String,
	num : String,
    name : String,
    chromas : String,
    price : String,
    type: String,
    imageLoading : String,
    imageFull : String,
    link : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('skin', championSchema);