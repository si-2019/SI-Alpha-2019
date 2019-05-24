const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

//http://localhost:31901/api/odsjek/DeleteOdsjek?id=broj_id
odsjekRouter.delete('/DeleteOdsjek', function(req, res){
	res.contentType('application/json');
	var id = req.query.id;
	console.log("Primio se zahtjev za brisanje odsjeka");
	db.Odsjek.findByPk(id)
	.then(data => {
		if(!data){
			console.log("Odsjek nije u bazi");
			res.status(400).end(JSON.stringify({message: "Odsjek nije u bazi"}));
		}
		else{
		//data sadrzi odsjek koji se treba obrisati
			data.destroy();
			console.log("Odsjek je obrisan\n");
			res.status(200).end(JSON.stringify({message: "Odsjek je obrisan"}));
		}
	});
});

module.exports = odsjekRouter;