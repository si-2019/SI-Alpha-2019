const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

odsjekRouter.get('/GetOdsjeci', function(req, res){
	res.contentType('application/json');
	console.log("Pretražuje bazu podataka");
	db.Odsjek.findAll({
    })
    .then(data => {
		//data sadrzi listu odsjeka, pretvara se u JSON i šalje
		console.log("Vraća se lista odsjeka\n");
		res.status(200).end(JSON.stringify(data));
	});
});

module.exports = odsjekRouter;
