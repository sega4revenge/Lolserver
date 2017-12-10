'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const spellSchema = mongoose.Schema({
    id             : String,
	name : {
        en : String,
        vn : String
    },
    description :{
        en : String,
        vn : String
    },
    link : String,
    tooltip : {
        en : String,
        vn : String
    }
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('spell', spellSchema);