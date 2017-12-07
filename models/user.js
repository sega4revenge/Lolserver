'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const championSchema = mongoose.Schema({
    id             : String,
	phone : { type: String, unique: true },
	email : String,
    hashed_password    : String,
    created_at        : String,
    photoprofile : String,
    tokenfirebase : String,
	temp_password : String,
	temp_password_time : String,
    status_code : String,
    facebook :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String,
		temp_password : String,
		temp_password_time : String,
		status_code : String

    },
    google :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String,
		temp_password : String,
		temp_password_time : String,
		status_code : String
    },
    listproduct: [{type: Schema.Types.ObjectId, ref: 'product'}],
	listsavedproduct: [{type: Schema.Types.ObjectId, ref: 'product'}]

});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('champion', championSchema);