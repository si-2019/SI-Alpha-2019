const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

odsjekRouter.post('/SpojiOdsjekPredmet', function(req, res){
	res.contentType('application/json');
	let GOD;
	if(!req.query.idOdsjek || !req.query.idPredmet || !req.query.godina || !req.query.ciklus || !req.query.semestar || !req.query.obavezan || req.query.idPredmet < 1
	|| req.query.semestar<1 || req.query.semestar>2 || req.query.obavezan<0 || req.query.obavezan>1 || req.query.godina<1 || req.query.ciklus<1 || req.query.idOdsjek < 1){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	else{
	//Posto u bazi je bilo potrebno postaviti ograničenje na broj semestara, ciklusa i godina na jedan drugi nacin, 
	//sljedeci kod konvertuje vrijednosti ciklusa i godine u onu vrijednost pogodnu za bazu
		if(req.query.ciklus==1 && req.query.godina<4){
			GOD=Number(req.query.godina);
		}
		else if(req.query.ciklus==2 && req.query.godina<3){
			GOD=Number(req.query.godina) + 3;
		}
		else if(req.query.ciklus==3 && req.query.godina<3){
			GOD=Number(req.query.godina) + 5;
		}
		else{
			res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
		}
	//Potrebno je koristiti Promise ovdje, jer se trebaju pretraziti predmet i odsjek po id-u
		console.log("Pokusaj pronalaska predmeta i odsjeka");
		let Predmet;
		let Odsjek;
		let ListaPromisea =[];
		ListaPromisea.push(db.Odsjek.findByPk(req.query.idOdsjek).then(nadeniOdsjek =>{
			Odsjek=nadeniOdsjek;
		}).catch(function(err){
			res.status(400).end(JSON.stringify({message: "Nije se mogao naci odsjek"}));
			}))
		
		ListaPromisea.push(db.Predmet.findByPk(req.query.idPredmet).then(nadeniPredmet =>{
			Predmet=nadeniPredmet;
		}).catch(function(err){
			res.status(400).end(JSON.stringify({message: "Nije se mogao naci predmet"}));
			}))
		
	//Nakon sto se nadu predmet i odsjek u bazi, stavlja se veza medu njih
		console.log("Pokusaj spajanja...");
		new Promise(function(resolve,reject){
			Promise.all(ListaPromisea).then(function(vrijednost){
	//Spajaju se, takoder se unose ostale vrijednosti potrebni za medutabelu
				if(!Odsjek || !Predmet){
					res.status(400).end(JSON.stringify({message: "Nije se moglo staviti u medutabeli"}));
				}
				else{
					Odsjek.addPredmeti(Predmet, {
						through: {
							semestar: req.query.semestar,
							godina: GOD,
							obavezan: req.query.obavezan
						}
					})
					.then(spoj =>{
						console.log("Uspjesno spojeno\n");
	//Vraca JSON vrijednosti medutabele u slucaju da je novi unos, 0 ako vec isti red se nalazio u redu 
	//i 1 ako se red nalazio u tabeli, ali ima nove vrijednosti (semestar, godina, obavezan)
						res.status(200).end(JSON.stringify(spoj));
					});
				}
			return new Promise(function(resolve,reject){resolve(vrijednost);});
			})
		}).catch(function(err){res.status(400).end(JSON.stringify({message: "Nije se moglo staviti u medutabeli"}));});
	}
});

module.exports = odsjekRouter;
