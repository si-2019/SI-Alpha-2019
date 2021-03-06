const express = require('express');
const predmetRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

//Nade se predmet u bazi i salje se frontend dijelu za izmjenu podataka
//http://localhost:31901/api/predmet/GetPredmet?naziv=naziv_predmet
predmetRouter.get('/GetPredmet', function(req, res){
	res.contentType('application/json');
	var naziv = decodeURIComponent(req.query.naziv);
	console.log("Primio se zahtjev za slanje odabranog predmeta");
	db.Predmet.findOne({where:{naziv: naziv}})
	.then(data => {
		if(!data){
			console.log("Predmet nije u bazi");
			res.status(400).end(JSON.stringify({message: "Predmet nije u bazi"}));
		}
		else{
		//data sadrzi predmet, pretvara se u JSON i šalje nazad
			console.log("Vraća se predmet\n");
			res.status(200).end(JSON.stringify(data));
		}
	});
});

predmetRouter.post('/PromijeniPredmet', function(req, res){
	res.contentType('application/json');
	console.log("Provjera validnosti unesenih vrijednosti");
	let body = req.body;
	//U slučaju da su unesene vrijednosti prazne, vraca gresku
	if(!parseInt(body.Id) || !parseInt(body.ects) || !parseInt(body.brojPredavanja) || !parseInt(body.brojVjezbi)){
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	if(!body.Id || !body.naziv || !body.ects || !body.brojPredavanja || !body.brojVjezbi || !body.opis || body.naziv.length>255 || body.naziv.opis>1024){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	else{
		console.log("Pretražuje bazu podataka");
	//Pretrazuje da li ima predmet u bazi
		db.Predmet.findByPk(body.Id)
		.then(data => {
			if(!data){
				console.log("Predmet nije u bazi");
				res.status(400).end(JSON.stringify({message: "Predmet nije u bazi"}));
			}
			else{
				console.log("Pokusaj izmjene predmeta");
				data.update({
					naziv: body.naziv,
					ects: body.ects,
					brojPredavanja: body.brojPredavanja, 
					brojVjezbi: body.brojVjezbi, 
					opis: body.opis
				});
				console.log("Uspješno izmjenjen predmet\n");
				res.status(200).end(JSON.stringify(data));
			}
		});
	}
});

module.exports = predmetRouter;
