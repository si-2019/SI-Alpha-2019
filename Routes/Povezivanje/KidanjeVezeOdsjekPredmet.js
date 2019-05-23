const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

odsjekRouter.delete('/BrisiOdsjekPredmet', function(req, res){
	res.contentType('application/json');
	let body = req.body;
	if(!body.idOdsjek || !body.idPredmet){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	else{
	//Potrebno je koristiti Promise ovdje, jer se trebaju pretraziti predmet i odsjek po id-u
		console.log("Pokusaj pronalaska predmeta i odsjeka");
		let Predmet;
		let Odsjek;
		let ListaPromisea =[];
		ListaPromisea.push(db.Odsjek.findByPk(body.idOdsjek).then(nadeniOdsjek =>{
			Odsjek=nadeniOdsjek;
		}).catch(function(err){
			res.status(400).end(JSON.stringify({message: "Nije se mogao naci odsjek"}));
			}))
		
		ListaPromisea.push(db.Predmet.findByPk(body.idPredmet).then(nadeniPredmet =>{
			Predmet=nadeniPredmet;
		}).catch(function(err){
			res.status(400).end(JSON.stringify({message: "Nije se mogao naci odsjek"}));
			}))
		
	//Nakon sto se nadu predmet i odsjek u bazi, otklanja se veza medu njih
		console.log("Pokusaj otklanjanja veze...");
		new Promise(function(resolve,reject){
			Promise.all(ListaPromisea).then(function(vrijednost){
	//Spajaju se, takoder se unose ostale vrijednosti potrebni za medutabelu
				if(!Odsjek || !Predmet){
					res.status(400).end(JSON.stringify({message: "Nije odsjek/predmet naden"}));
				}
				else{
					Odsjek.removePredmeti(Predmet).then(deletion =>{
						console.log("Uspjesno otklonjena veza\n");
	//Vraca JSON vrijednost,0 ako veza između odabranog predmeta i odsjeka uopće nije postojala 
	//i 1 ako se veza nalazila u medutabeli 
						res.status(200).end(JSON.stringify(deletion));
					});
				}
			return new Promise(function(resolve,reject){resolve(vrijednost);});
			})
		}).catch(function(err){res.status(400).end(JSON.stringify({message: "Greska se javila"}));});
	}
});

module.exports = odsjekRouter;