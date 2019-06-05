const express = require('express');
const predmetRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

predmetRouter.get('/GetPredmeti', function(req, res){
	res.contentType('application/json');
	console.log("Pretražuje bazu podataka");
	db.Predmet.findAll({
    })
    .then(data => {
		//data sadrzi listu predmeta, pretvara se u JSON i šalje
		console.log("Vraća se lista predmeta\n");
		res.status(200).end(JSON.stringify(data));
	});
});

module.exports = predmetRouter;
