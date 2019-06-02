const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
const Op = db.Sequelize.Op;
db.sequelize.sync();

odsjekRouter.get('/PretraziOdsjekPredmet', function(req, res){
	res.contentType('application/json');
	let GOD;
	if(!parseInt(req.query.idOdsjek) || !parseInt(req.query.godina) || !parseInt(req.query.ciklus) || !parseInt(req.query.semestar) || !parseInt(req.query.obavezan)){
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	if(!req.query.idOdsjek ||!req.query.godina || !req.query.ciklus || !req.query.semestar || !req.query.obavezan || req.query.semestar<1 
	|| req.query.semestar>2 || req.query.obavezan<0 || req.query.obavezan>1 || req.query.godina<1 || req.query.ciklus<1 || req.query.idOdsjek<1){
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
	//Potrebno naći sve redove u medutabeli koji odgovaraju unesenim vrijednostima
		console.log("Pokusaj pronalaska svih redova u medutabeli koji zadovoljavaju unesene vrijednoti");
		db.odsjek_predmet.findAll({
			where: {
				idOdsjek: req.query.idOdsjek,
				semestar: req.query.semestar,
				godina: GOD,
				obavezan: req.query.obavezan
			}
		})
		.then(data => {
	//Kad se nadu svi redovi, potrebno ih je pretvoriti u JSON da bi se moglo sa njima raditi
			var jsonData = JSON.parse(JSON.stringify(data));
			console.log("Traze se svi predmeti koji su bili u medutabeli");
			db.Predmet.findAll({
	//Pretrazuju se svi predmeti koji su bili u medutabeli
				where:{
					id: {
						[Op.or]: [jsonData.map(a => a.idPredmet)]
					}
				}
			})
			.then(data2 => {
				console.log("Vraca se rezultat pretrage\n");
				res.status(200).end(JSON.stringify(data2));
			});
		});
	}
});

module.exports = odsjekRouter;
