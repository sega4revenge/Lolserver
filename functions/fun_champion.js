"use strict";

const champion = new require("../models/champion");


exports.championUser = (name) =>

	new Promise((resolve, reject) => {


		champion.find({id: name})

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
