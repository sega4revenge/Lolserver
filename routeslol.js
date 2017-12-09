'use strict';


const request = require("request");
const skin = new require("./models/skin");
const fun_champion = new require("./functions/fun_champion");
const champion = new require("./models/champion");
const spell = new require("./models/spell");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const async = require("async");

const url = "mongodb://sega:sega4deptrai@45.77.36.109:27017/lol?authSource=admin";
module.exports = router => {
    router.get('/data/:id', (req, res) => {

        console.log("name champion" + req.params.id);
        const id = req.params.id;
        fun_champion.championUser(id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({message: err.message}));


    });

    router.get('/listchampion', function (req, res) {

        console.log("bat dau");
        request({
            method: "GET",
            url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion.json",
            json: true
        }, function (err, response, body) {
            let page = 0;
            const keys = Object.keys(body.data);
            async.whilst(function () {
                    return page < keys.length;
                },
                function (next) {
                    const name = keys[page];
                    request({
                        method: "GET",
                        url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion/" + name + ".json",
                        json: true
                    }, function (err, response, body) {
                        console.log(name);
                        champion.find({id: body.data[name].id})
                            .then(champions => {

                                if (champions.length === 0) {

                                    let newChampion = new champion({
                                        id: body.data[name].id,
                                        key: body.data[name].key,
                                        name: body.data[name].name,
                                        title: body.data[name].title,
                                        imageAvatar: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png",
                                        lore: body.data[name].lore,
                                        blurb: body.data[name].blurb,
                                        partype: body.data[name].partype,
                                        info: {
                                            attack: body.data[name].info.attack,
                                            defense: body.data[name].info.defense,
                                            magic: body.data[name].info.magic,
                                            difficulty: body.data[name].info.difficulty
                                        },
                                        stats: {
                                            armor: body.data[name].stats.armor,
                                            armorperlevel: body.data[name].stats.armorperlevel,
                                            attackdamage: body.data[name].stats.attackdamage,
                                            attackdamageperlevel: body.data[name].stats.attackdamageperlevel,
                                            attackrange: body.data[name].stats.attackrange,
                                            attackspeedoffset: body.data[name].stats.attackspeedoffset,
                                            attackspeedperlevel: body.data[name].stats.attackspeedperlevel,
                                            crit: body.data[name].stats.crit,
                                            critperlevel: body.data[name].stats.critperlevel,
                                            hp: body.data[name].stats.hp,
                                            hpperlevel: body.data[name].stats.hpperlevel,
                                            hpregen: body.data[name].stats.hpregen,
                                            hpregenperlevel: body.data[name].stats.hpregenperlevel,
                                            movespeed: body.data[name].stats.movespeed,
                                            mp: body.data[name].stats.mp,
                                            mpperlevel: body.data[name].stats.mpperlevel,
                                            mpregen: body.data[name].stats.mpregen,
                                            mpregenperlevel: body.data[name].stats.mpregenperlevel,
                                            spellblock: body.data[name].stats.spellblock,
                                            spellblockperlevel: body.data[name].stats.spellblockperlevel
                                        },
                                        passive: {
                                            name: body.data[name].passive.name,
                                            description: body.data[name].passive.description,
                                            imagePassive: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full
                                        }
                                    });
                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: body.data[name].spells[i].name,
                                                        description: body.data[name].spells[i].description,
                                                        tooltip: body.data[name].spells[i].tooltip

                                                    });
                                                    newSpell.save();
                                                    newChampion.spells.push(newSpell);

                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name = body.data[name].spells[i].name;
                                                    spells[0].description = body.data[name].spells[i].description;
                                                    spells[0].tooltip = body.data[name].spells[i].tooltip;


                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);
                                                reject({status: 500, message: err.message});
                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        newChampion.allytips.push(body.data[name].allytips[i]);
                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        newChampion.enemytips.push(body.data[name].enemytips[i]);
                                    }
                                    for (let i = 0; i < body.data[name].tags.length; i++) {
                                        newChampion.tags.push(body.data[name].tags[i]);
                                    }
                                    for (let i = 0; i < body.data[name].skins.length; i++) {
                                        skin.find({id: body.data[name].skins[i].id})
                                            .then(skins => {

                                                if (skins.length === 0) {

                                                    let newSkin = new skin({
                                                        id: body.data[name].skins[i].id,
                                                        num: body.data[name].skins[i].num,
                                                        name: body.data[name].skins[i].name,
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    newChampion.skins.push(newSkin);

                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"


                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);
                                                reject({status: 500, message: err.message});
                                            });

                                    }

                                    newChampion.save();

                                } else {
                                    champions[0].id = body.data[name].id;
                                    champions[0].key = body.data[name].key;
                                    champions[0].name = body.data[name].name;
                                    champions[0].title = body.data[name].title;
                                    champions[0].imageAvatar = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png", champions[0].lore = body.data[name].lore;
                                    champions[0].blurb = body.data[name].blurb;
                                    champions[0].partype = body.data[name].partype;
                                    champions[0].info.attack = body.data[name].info.attack;
                                    champions[0].info.defense = body.data[name].info.defense;
                                    champions[0].info.magic = body.data[name].info.magic;
                                    champions[0].info.difficulty = body.data[name].info.difficulty;
                                    champions[0].info.attack = body.data[name].info.attack;
                                    champions[0].stats.armor = body.data[name].stats.armor;
                                    champions[0].stats.armorperlevel = body.data[name].stats.armorperlevel;
                                    champions[0].stats.attackdamage = body.data[name].stats.attackdamage;
                                    champions[0].stats.attackdamageperlevel = body.data[name].stats.attackdamageperlevel;
                                    champions[0].stats.attackrange = body.data[name].stats.attackrange;
                                    champions[0].stats.attackspeedoffset = body.data[name].stats.attackspeedoffset;
                                    champions[0].stats.attackspeedperlevel = body.data[name].stats.attackspeedperlevel;
                                    champions[0].stats.crit = body.data[name].stats.crit;
                                    champions[0].stats.critperlevel = body.data[name].stats.critperlevel;
                                    champions[0].stats.hp = body.data[name].stats.hp;
                                    champions[0].stats.hpperlevel = body.data[name].stats.hpperlevel;
                                    champions[0].stats.hpregen = body.data[name].stats.hpregen;
                                    champions[0].stats.hpregenperlevel = body.data[name].stats.hpregenperlevel;
                                    champions[0].stats.movespeed = body.data[name].stats.movespeed;
                                    champions[0].stats.mp = body.data[name].stats.mp;
                                    champions[0].stats.mpperlevel = body.data[name].stats.mpperlevel;
                                    champions[0].stats.mpregen = body.data[name].stats.mpregen;
                                    champions[0].stats.mpregenperlevel = body.data[name].stats.mpregenperlevel;
                                    champions[0].stats.spellblock = body.data[name].stats.spellblock;
                                    champions[0].stats.spellblockperlevel = body.data[name].stats.spellblockperlevel;
                                    champions[0].passive.name = body.data[name].passive.name;
                                    champions[0].passive.description = body.data[name].passive.description;
                                    champions[0].passive.imagePassive = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full;
                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: body.data[name].spells[i].name,
                                                        description: body.data[name].spells[i].description,
                                                        tooltip: body.data[name].spells[i].tooltip

                                                    });
                                                    newSpell.save();
                                                    champions[0].spells.splice(i,1);
                                                    champions[0].spells.push(newSpell);

                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name = body.data[name].spells[i].name;
                                                    spells[0].description = body.data[name].spells[i].description;
                                                    spells[0].tooltip = body.data[name].spells[i].tooltip;


                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);
                                                reject({status: 500, message: err.message});
                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        champions[0].allytips[i] = body.data[name].enemytips[i];
                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        champions[0].enemytips[i] = body.data[name].enemytips[i];
                                    }
                                    for (let i = 0; i < body.data[name].tags.length; i++) {
                                        champions[0].tags[i] = body.data[name].tags[i];
                                    }
                                    for (let i = 0; i < body.data[name].skins.length; i++) {
                                        skin.find({id: body.data[name].skins[i].id})
                                            .then(skins => {

                                                if (skins.length === 0) {

                                                    let newSkin = new skin({
                                                        id: body.data[name].skins[i].id,
                                                        num: body.data[name].skins[i].num,
                                                        name: body.data[name].skins[i].name,
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    champions[0].skins.push(newSkin);

                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"


                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);
                                                reject({status: 500, message: err.message});
                                            });

                                    }
                                }
                            })
                            .catch(err => {
                                console.log(err.message);

                            });
                        page++;
                        next();

                        /*    let newChampion = new champion({
                                id             : body.data[name].id,
                                key : body.data[name].key,
                                name :body.data[name].name,
                                title    : body.data[name].title,
                                imageAvatar : "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/"+name+".png",
                                lore :  body.data[name].lore,
                                blurb :  body.data[name].blurb,
                                partype :  body.data[name].partype,
                                info : {
                                    attack :  body.data[name].info.attack,
                                    defense : body.data[name].info.defense,
                                    magic : body.data[name].info.magic,
                                    difficulty : body.data[name].info.difficulty
                                },
                                stats : {
                                    armor : body.data[name].stats.armor,
                                    armorperlevel : body.data[name].stats.armorperlevel,
                                    attackdamage : body.data[name].stats.attackdamage,
                                    attackdamageperlevel: body.data[name].stats.attackdamageperlevel,
                                    attackrange : body.data[name].stats.attackrange,
                                    attackspeedoffset : body.data[name].stats.attackspeedoffset,
                                    attackspeedperlevel : body.data[name].stats.attackspeedperlevel,
                                    crit : body.data[name].stats.crit,
                                    critperlevel : body.data[name].stats.critperlevel,
                                    hp : body.data[name].stats.hp,
                                    hpperlevel : body.data[name].stats.hpperlevel,
                                    hpregen : body.data[name].stats.hpregen,
                                    hpregenperlevel : body.data[name].stats.hpregenperlevel,
                                    movespeed : body.data[name].stats.movespeed,
                                    mp : body.data[name].stats.mp,
                                    mpperlevel : body.data[name].stats.mpperlevel,
                                    mpregen : body.data[name].stats.mpregen,
                                    mpregenperlevel : body.data[name].stats.mpregenperlevel,
                                    spellblock : body.data[name].stats.spellblock,
                                    spellblockperlevel :body.data[name].stats.spellblockperlevel
                                },
                                passive : {
                                    name :body.data[name].passive.name,
                                    description : body.data[name].passive.description,
                                    imagePassive : "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full
                                }
                            });
                            for (let i = 0; i < body.data[name].spells.length; i++) {
                                let newSpell = new spell({
                                    id: body.data[name].spells[i].id,
                                    name: body.data[name].spells[i].name,
                                    description : body.data[name].spells[i].description,
                                    tooltip : body.data[name].spells[i].tooltip

                                });
                                newSpell.save();
                                newChampion.spells.push(newSpell);
                            }
                            for (let i = 0; i < body.data[name].allytips.length; i++) {
                              newChampion.allytips.push(body.data[name].allytips[i]);
                            }
                            for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                newChampion.enemytips.push(body.data[name].enemytips[i]);
                            }
                            for (let i = 0; i < body.data[name].tags.length; i++) {
                                newChampion.tags.push(body.data[name].tags[i]);
                            }
                            for (let i = 0; i < body.data[name].skins.length; i++) {
                                let newSkin = new skin({
                                    id: body.data[name].skins[i].id,
                                    num: body.data[name].skins[i].num,
                                    name: body.data[name].skins[i].name,
                                    chromas: body.data[name].skins[i].chromas,
                                    imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                    imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                });
                                newSkin.save();
                                newChampion.skins.push(newSkin);
                            }

                            newChampion.save();
                            page++;
                            next();*/

                        /*    for (let i = 0; i < body.data[name].skins.length; i++) {
                               let newSkin = new skin({
                                   id             : body.data[name].skins[i].id,
                                   num : body.data[name].skins[i].num,
                                   name : body.data[name].skins[i].name,
                                   chromas : body.data[name].skins[i].chromas,
                                   imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/"+ body.data[name].name+"_"+body.data[name].skins[i].num +".jpg",
                                   imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ body.data[name].name+"_"+body.data[name].skins[i].num +".jpg"
                               });
                                newSkin.save();
                            }*/

                        /*  newChampion = new champion({
                              name: name,
                              email: email,
                              hashed_password: "",
                              phone: phone,
                              photoprofile: photoprofile,
                              tokenfirebase: tokenfirebase,
                              created_at: new Date(),
                              status_code: "0",
                              facebook: {
                                  id: id,
                                  token: token,
                                  name: name,
                                  email: email,
                                  photoprofile: photoprofile,
                                  temp_password: code,
                                  temp_password_time: new Date(),
                                  status_code: "0"
                              }
                          });*/

                    })
                },
                function (err) {
                    // All things are done!
                });
            /*   const promises = [];
               for (let i = 0; i < keys.length; i++) {
                   promises .push(getData(keys[i]));
               }
               Promise.all(promises)
                   .then(result => {

                   })
                   .catch(err => {

                   });*/


            /*
                        for (let i = 0; i < keys.length; i++) {


                            request({
                                method: "GET",
                                url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion/" + keys[i] + ".json",
                                json: true
                            }, function (err, response, body) {
                                /!*  const keys = Object.keys(body.data);*!/
                                res.json(body.data);
                                /!* for(let i = 0; i < keys.length; i++){
                                     console.log(keys[i]);
                                 }*!/
                                /!*MongoClient.connect(url, function(err, db) {
                                    assert.equal(null, err);
                                    db.collection('champion').insertOne( {body
                                    }, function(err, result) {
                                        assert.equal(err, null);
                                        console.log("Inserted a document into the restaurants collection.");
                                        db.close();
                                    });
                                });*!/


                            })
                        }
                        /!*MongoClient.connect(url, function(err, db) {
                            assert.equal(null, err);
                            db.collection('champion').insertOne( {body
                            }, function(err, result) {
                                assert.equal(err, null);
                                console.log("Inserted a document into the restaurants collection.");
                                db.close();
                            });
                        });*!/*/


        })

    });

};
