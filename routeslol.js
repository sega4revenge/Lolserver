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

        console.log("name champion"+req.params.id);
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
                        let newChampion = new champion({
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
                                imagePassive : "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/passive/" + body.data[name].passive.image.full
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
                                imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "/_" + body.data[name].skins[i].num + ".jpg",
                                imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "/_" + body.data[name].skins[i].num + ".jpg"
                            });
                            newSkin.save();
                            newChampion.skins.push(newSkin);
                        }

                        newChampion.save();
                        page++;
                        next();

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
