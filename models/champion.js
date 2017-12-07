'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const championSchema = mongoose.Schema({
    id             : String,
	key : String,
	name : String,
    title    : String,
    imageAvatar : String,
    skins : [{type: Schema.Types.ObjectId, ref: 'skin'}],
    lore : String,
    blurb : String,
    allytips : [String],
    enemytips : [String],
    tags : [String],
    partype : String,
    info : {
        attack : String,
        defense : String,
        magic : String,
        difficulty : String
    },
    stats : {
        armor : String,
        armorperlevel : String,
        attackdamage : String,
        attackdamageperlevel: String,
        attackrange : String,
        attackspeedoffset : String,
        attackspeedperlevel : String,
        crit : String,
        critperlevel : String,
        hp : String,
        hpperlevel : String,
        hpregen : String,
        hpregenperlevel : String,
        movespeed : String,
        mp : String,
        mpperlevel : String,
        mpregen : String,
        mpregenperlevel : String,
        spellblock : String,
        spellblockperlevel : String
    },
    spells : [{type: Schema.Types.ObjectId, ref: 'spell'}],
    passive : {
        name : String,
        description : String,
        imagePassive : String
    }

});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('champion', championSchema);