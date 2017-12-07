'use strict';


const request = require("request");
const champion = new require("../models/champion");
const skin = new require("../models/skin");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://sega:sega4deptrai@45.77.36.109:27017/lol?authSource=admin";
module.exports = router => {
    function getData(name) {
        return new Promise(function (resolve, reject) {
            let newChampion;
            request({
                method: "GET",
                url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion/" + name + ".json",
                json: true
            }, function (err, response, body) {
                if(err) reject({status: 500, message: err.message});
                for (let i = 0; i < body.data[name].skins.length; i++) {
                   let newSkin = new skin({
                       id             : body.data[name].skins[i].id,
                       num : body.data[name].skins[i].num,
                       name : body.data[name].skins[i].name,
                       chromas : body.data[name].skins[i].chromas,
                       imageLoading: "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/"+ body.data[name].name+"_"+body.data[name].skins[i].num +".jpg",
                       imageFull: "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ body.data[name].name+"_"+body.data[name].skins[i].num +".jpg"
                   });
                    newSkin.save();
                    console.log(newSkin.imageLoading);
                }
                resolve({
                    status: 202,
                    message: "success"
                });
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
            // place here your logic
            // return resolve([result object]) in case of success
            // return reject([error object]) in case of error
        });
    }

    router.get('/listchampion', function (req, res) {

        console.log("bat dau");
        request({
            method: "GET",
            url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion.json",
            json: true
        }, function (err, response, body) {
            const keys = Object.keys(body.data);
            const promises = [];
            for (let i = 0; i < keys.length; i++) {
                promises .push(getData(keys[i]));
            }
            Promise.all(promises)
                .then(result => {
                  console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });










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
