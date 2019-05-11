const express = require('express');
const predmetRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

predmetRouter.post('/AddNewPredmet', function(req, res){
	console.log("Provjera validnosti unesenih vrijednosti");
	let body = req.body;
	//U slučaju da je uneseno prazno ime, vraca gresku
	if(!body.naziv || !body.ects || !body.brojPredavanja || !body.brojVjezbi || !body.opis || body.naziv.length>255 || body.naziv.opis>1024){
		res.status(400).end("Nisu sve vrijednosti validni");
	}
	else{
		console.log("Pretražuje bazu podataka");
	//Pretrazuje da li ima vec isto ime u bazi
		db.Predmet.findAll({
			where:{
				naziv: String(body.naziv)
			}
		})
		.then(data => {
			console.log("Pokusaj dodavanja predmeta");
			if(data.length!=0){
				res.status(400).end("Predmet je vec u bazi");
			}
	//Dodaje u bazi predmet
			else{
				db.Predmet.create({
					naziv: body.naziv, 
					ects: body.ects, 
					brojPredavanja: body.brojPredavanja, 
					brojVjezbi: body.brojVjezbi, 
					opis: body.opis
				})
				.then(predmet => {
					console.log("Dodano u bazi podataka\n");
					res.status(200).end(JSON.stringify(predmet));
				});
			}
		});
	}
});

module.exports = predmetRouter;