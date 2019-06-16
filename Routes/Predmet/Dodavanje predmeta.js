const express = require('express');
const predmetRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

predmetRouter.post('/AddNewPredmet', function(req, res){
	res.contentType('application/json');
	console.log("Provjera validnosti unesenih vrijednosti");
	let body = req.body;
	//U slučaju da unesene vrijednosti nisu validne, vraca gresku
	if(!parseInt(body.ects) || !parseInt(body.brojPredavanja) || !parseInt(body.brojVjezbi)){
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	if(!body.naziv || !body.ects || !body.brojPredavanja || !body.brojVjezbi || !body.opis || body.naziv.length>255 || body.naziv.opis>1024){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validni"}));
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
				res.status(400).end(JSON.stringify({message: "Predmet je vec u bazi"}));
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
