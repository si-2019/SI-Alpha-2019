const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

odsjekRouter.post('/SpojiOdsjekPredmet', function(req, res){
	res.contentType('application/json');
	let body = req.body;
	let GOD;
	/*if(!parseInt(body.idOdsjek) || !parseInt(body.idPredmet) || !parseInt(body.ciklus) || !parseInt(body.semestar) || !parseInt(body.obavezan) || !parseInt(body.godina)){
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne111"}));
	}*/
	if(!body.idOdsjek || !body.idPredmet || !body.godina || !body.ciklus || !body.semestar || !body.obavezan || body.idPredmet < 1
	|| body.semestar<1 || body.semestar>2 || body.obavezan<0 || body.obavezan>1 || body.godina<1 || body.ciklus<1 || body.idOdsjek < 1){
		res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	else{
	//Posto u bazi je bilo potrebno postaviti ograničenje na broj semestara, ciklusa i godina na jedan drugi nacin, 
	//sljedeci kod konvertuje vrijednosti ciklusa i godine u onu vrijednost pogodnu za bazu
		if(body.ciklus==1 && body.godina<4){
			GOD=Number(body.godina);
		}
		else if(body.ciklus==2 && body.godina<3){
			GOD=Number(body.godina) + 3;
		}
		else if(body.ciklus==3 && body.godina<3){
			GOD=Number(body.godina) + 5;
		}
		else{
			res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
		}
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
							semestar: body.semestar,
							godina: GOD,
							obavezan: body.obavezan
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
