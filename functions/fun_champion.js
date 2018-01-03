"use strict";

const champion = new require("../models/champion");
const skin = new require("../models/skin");
const linkyoutube = new require("../models/linkyoutube");
exports.championUser = (name) =>

	new Promise((resolve, reject) => {


		champion.find({id: name})
            .populate({
                path: "skins spells"
            })
			.then(champions => {

				if (champions.length === 0) {

					reject({status: 404, message: "Champion Not Found !"});

				} else {

					return champions[0];


				}
			})
			.then(champion => {

                resolve({status: 200, champion:champion});
			})

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});
exports.fullChampions = () =>

    new Promise((resolve, reject) => {


        champion.find({},{id :1,imageAvatar : 1,name : 1 ,_id : 0})
            .then(champions => {

                if (champions.length === 0) {

                    reject({status: 404, message: "Champion Not Found !"});

                } else {

                    return champions;


                }
            })
            .then(champion => {

                for (let i = 0; i < champion.length; i++) {

                    console.log(champion[i].id)

                }
                resolve({status: 200, listchampion:champion});
            })

            .catch(err => {
                console.log(err.message);
                reject({status: 500, message: err.message});
            });

    });
