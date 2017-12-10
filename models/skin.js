'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const championSchema = mongoose.Schema({
    id             : String,
	num : String,
    name : {
        en : String,
        vn : String
    },
    chromas : String,
    price : {
        en : String,
        vn : String
    },
    type: String,
    imageLoading : String,
    imageFull : String,
    link : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('skin', championSchema);