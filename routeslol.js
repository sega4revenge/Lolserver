'use strict';


const request = require("request");
const skin = new require("./models/skin");
const fun_champion = new require("./functions/fun_champion");
const champion = new require("./models/champion");
const spell = new require("./models/spell");
const async = require("async");


module.exports = router => {
    router.get('/data/:id', (req, res) => {

        console.log("name champion" + req.params.id);
        const id = req.params.id;
        fun_champion.championUser(id)

            .then(result => res.json(result))

            .catch(err => res.status(err.status).json({message: err.message}));


    });
    router.get('/listchampionen', function (req, res) {

        console.log("bat dau");
        request({
            method: "GET",
            url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json",
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
                        url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion/" + name + ".json",
                        json: true
                    }, function (err, response, body) {

                        champion.find({id: body.data[name].id})
                            .then(champions => {

                                if (champions.length === 0) {

                                    let newChampion = new champion({
                                        id: body.data[name].id,
                                        key: body.data[name].key,
                                        name: body.data[name].name,
                                        title: {
                                            en: body.data[name].title,
                                            vn: ""
                                        },
                                        price: "",
                                        imageAvatar: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png",
                                        lore: {
                                            en: body.data[name].lore,
                                            vn: ""
                                        },
                                        blurb: {
                                            en: body.data[name].blurb,
                                            vn: ""
                                        },
                                        partype: {
                                            en: body.data[name].partype,
                                            vn: ""
                                        },
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
                                            name: {
                                                en: body.data[name].passive.name,
                                                vn: ""
                                            },
                                            description: {
                                                en: body.data[name].passive.description,
                                                vn: ""
                                            },
                                            imagePassive: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full
                                        }
                                    });
                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: {
                                                            en: body.data[name].spells[i].name,
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        description: {
                                                            en: body.data[name].spells[i].description,
                                                            vn: ""
                                                        },
                                                        tooltip: {
                                                            en: body.data[name].spells[i].tooltip,
                                                            vn: ""
                                                        },

                                                    });
                                                    newSpell.save();
                                                    newChampion.spells.push(newSpell);


                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name.en = body.data[name].spells[i].name;
                                                    spells[0].description.en = body.data[name].spells[i].description;
                                                    spells[0].tooltip.en = body.data[name].spells[i].tooltip;
                                                    spells[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        newChampion.allytips.en.push(body.data[name].allytips[i]);
                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        newChampion.enemytips.en.push(body.data[name].enemytips[i]);
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
                                                        name: {
                                                            en: body.data[name].skins[i].name,
                                                            vn: ""
                                                        },
                                                        type: "",
                                                        price: {
                                                            en: "",
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    newChampion.skins.push(newSkin);

                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name.en = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";

                                                    skins[0].save();
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }

                                    newChampion.save();

                                } else {
                                    champions[0].id = body.data[name].id;
                                    champions[0].key = body.data[name].key;
                                    champions[0].name = body.data[name].name;
                                    champions[0].title.en = body.data[name].title;
                                    champions[0].imageAvatar = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png";
                                    champions[0].lore.en = body.data[name].lore;
                                    champions[0].blurb.en = body.data[name].blurb;
                                    champions[0].partype.en = body.data[name].partype;
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
                                    champions[0].passive.name.en = body.data[name].passive.name;
                                    champions[0].passive.description.en = body.data[name].passive.description;
                                    champions[0].passive.imagePassive = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full;
                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: {
                                                            en: body.data[name].spells[i].name,
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        description: {
                                                            en: body.data[name].spells[i].description,
                                                            vn: ""
                                                        },
                                                        tooltip: {
                                                            en: body.data[name].spells[i].tooltip,
                                                            vn: ""
                                                        },

                                                    });
                                                    newSpell.save();
                                                    champions[0].spells.splice(i, 1);
                                                    champions[0].spells.push(newSpell);

                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name.en = body.data[name].spells[i].name;
                                                    spells[0].description.en = body.data[name].spells[i].description;
                                                    spells[0].tooltip.en = body.data[name].spells[i].tooltip;
                                                    spells[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        champions[0].allytips.en[i] = body.data[name].enemytips[i];
                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        champions[0].enemytips.en[i] = body.data[name].enemytips[i];
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
                                                        name: {
                                                            en: body.data[name].skins[i].name,
                                                            vn: ""
                                                        },
                                                        type: "",
                                                        price: {
                                                            en: "",
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    champions[0].skins.push(newSkin);

                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name.en = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].save();


                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });


                                    }
                                    champions[0].save();
                                }
                            })
                            .catch(err => {
                                console.log(err.message);

                            });

                        page++;
                        next();


                    })

                },
                function (err) {
                    // All things are done!
                });

        })

    });
    router.get('/listchampionvn', function (req, res) {

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
                                        title: {
                                            en: "",
                                            vn: body.data[name].title
                                        },
                                        price: "",
                                        imageAvatar: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png",
                                        lore: {
                                            en: "",
                                            vn: body.data[name].lore
                                        },
                                        blurb: {
                                            en: "",
                                            vn: body.data[name].blurb
                                        },
                                        partype: {
                                            en: "",
                                            vn: body.data[name].partype
                                        },
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
                                            name: {
                                                en: "",
                                                vn: body.data[name].passive.name
                                            },
                                            description: {
                                                en: "",
                                                vn: body.data[name].passive.description
                                            },
                                            imagePassive: "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full
                                        }
                                    });


                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].name
                                                        },
                                                        link: "",
                                                        description: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].description
                                                        },
                                                        tooltip: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].tooltip
                                                        },

                                                    });
                                                    newSpell.save();
                                                    newChampion.spells.push(newSpell._id);
                                                    newChampion.save();
                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name.vn = body.data[name].spells[i].name;
                                                    spells[0].description.vn = body.data[name].spells[i].description;
                                                    spells[0].tooltip.vn = body.data[name].spells[i].tooltip;
                                                    spells[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        newChampion.allytips.vn.push(body.data[name].allytips[i]);

                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        newChampion.enemytips.vn.push(body.data[name].enemytips[i]);
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
                                                        name: {
                                                            en: "",
                                                            vn: body.data[name].skins[i].name
                                                        },
                                                        type: "",
                                                        price: {
                                                            en: "",
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    newChampion.skins.push(newSkin._id);
                                                    newChampion.save();
                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name.vn = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }


                                } else {
                                    champions[0].id = body.data[name].id;
                                    champions[0].key = body.data[name].key;
                                    champions[0].name = body.data[name].name;
                                    champions[0].title.vn = body.data[name].title;
                                    champions[0].imageAvatar = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + name + ".png";
                                    champions[0].lore.vn = body.data[name].lore;
                                    champions[0].blurb.vn = body.data[name].blurb;
                                    champions[0].partype.vn = body.data[name].partype;
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
                                    champions[0].passive.name.vn = body.data[name].passive.name;
                                    champions[0].passive.description.vn = body.data[name].passive.description;
                                    champions[0].passive.imagePassive = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + body.data[name].passive.image.full;
                                    for (let i = 0; i < body.data[name].spells.length; i++) {
                                        spell.find({id: body.data[name].spells[i].id})
                                            .then(spells => {

                                                if (spells.length === 0) {

                                                    let newSpell = new spell({
                                                        id: body.data[name].spells[i].id,
                                                        name: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].name
                                                        },
                                                        link: "",
                                                        description: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].description
                                                        },
                                                        tooltip: {
                                                            en: "",
                                                            vn: body.data[name].spells[i].tooltip
                                                        },

                                                    });
                                                    newSpell.save();
                                                    champions[0].spells.splice(i, 1);
                                                    champions[0].spells.push(newSpell._id);
                                                    champions[0].save();
                                                } else {

                                                    spells[0].id = body.data[name].spells[i].id;
                                                    spells[0].name.vn = body.data[name].spells[i].name;
                                                    spells[0].description.vn = body.data[name].spells[i].description;
                                                    spells[0].tooltip.vn = body.data[name].spells[i].tooltip;
                                                    spells[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });

                                    }
                                    for (let i = 0; i < body.data[name].allytips.length; i++) {
                                        champions[0].allytips.vn[i] = body.data[name].allytips[i];
                                    }
                                    for (let i = 0; i < body.data[name].enemytips.length; i++) {
                                        champions[0].enemytips.vn[i] = body.data[name].enemytips[i];
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
                                                        name: {
                                                            en: "",
                                                            vn: body.data[name].skins[i].name
                                                        },
                                                        type: "",
                                                        price: {
                                                            en: "",
                                                            vn: ""
                                                        },
                                                        link: "",
                                                        chromas: body.data[name].skins[i].chromas,
                                                        imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg",
                                                        imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg"
                                                    });
                                                    newSkin.save();
                                                    champions[0].skins.push(newSkin._id);
                                                    champions[0].save();
                                                } else {

                                                    skins[0].id = body.data[name].skins[i].id;
                                                    skins[0].num = body.data[name].skins[i].num;
                                                    skins[0].name.vn = body.data[name].skins[i].name;
                                                    skins[0].chromas = body.data[name].skins[i].chromas;
                                                    skins[0].imageLoading = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].imageFull = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + body.data[name].id + "_" + body.data[name].skins[i].num + ".jpg";
                                                    skins[0].save();

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err.message);

                                            });


                                    }
                                    champions[0].save();

                                }
                            })
                            .catch(err => {
                                console.log(err.message);

                            });

                        page++;
                        next();


                    })

                },
                function (err) {
                    // All things are done!
                });

        })

    });

};
