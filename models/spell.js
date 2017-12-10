'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const spellSchema = mongoose.Schema({
    id             : String,
    name : String,
    description : String,
    tooltip : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('spell', spellSchema);