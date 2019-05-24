const express = require('express');
const OdsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

//Nade se odsjek u bazi i salje se frontend dijelu za izmjenu podataka
//http://localhost:31901/api/odsjek/GetOdsjek?id=broj_id
OdsjekRouter.get('/GetOdsjek', function(req, res){
	res.contentType('application/json');
	var id = req.query.id;
	console.log("Primio se zahtjev za slanje odabranog odsjeka");
	db.Odsjek.findByPk(id)
	.then(data => {
		if(!data){
			console.log("Odsjek nije u bazi");
			res.status(400).end(JSON.stringify({message: "Odsjek nije u bazi"}));
		}
		else{
		//data sadrzi odsjek, pretvara se u JSON i šalje
			console.log("Vraća se odsjek\n");
			res.status(200).end(JSON.stringify(data));
		}
	});
});

OdsjekRouter.post('/PromijeniOdsjek', function(req, res){
	res.contentType('application/json');
	console.log("Provjera validnosti unesenih vrijednosti");
	let body = req.body;
	//U slučaju da su uneseni prazne vrijednosti, vraca gresku
	if(!body.idOdsjek || !body.naziv || body.naziv.length>25){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	else{
		console.log("Pretražuje bazu podataka");
	//Pretrazuje da li ima odsjek u bazi
		db.Odsjek.findByPk(body.idOdsjek)
		.then(data => {
			if(!data){
				console.log("Odsjek nije u bazi");
				res.status(400).end(JSON.stringify({message: "Odsjek nije u bazi"}));
			}
			else{
				console.log("Pokusaj izmjene odsjeka");
				data.update({
					naziv: body.naziv
				});
				console.log("Uspješno izmjenjen odsjek\n");
				res.status(200).end(JSON.stringify(data));
			}
		});
	}
});

module.exports = OdsjekRouter;
