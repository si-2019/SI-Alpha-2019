const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
const Op = db.Sequelize.Op;
db.sequelize.sync();

odsjekRouter.get('/PretraziOdsjekPredmet', function(req, res){
	res.contentType('application/json');
	let body = req.body;
	let GOD;
	if(!body.idOdsjek ||!body.godina || !body.ciklus || !body.semestar || !body.obavezan || body.semestar<1 
	|| body.semestar>2 || body.obavezan<0 || body.obavezan>1 || body.godina<1 || body.ciklus<1 || body.idOdsjek<1){
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
	//Potrebno naći sve redove u medutabeli koji odgovaraju unesenim vrijednostima
		console.log("Pokusaj pronalaska svih redova u medutabeli koji zadovoljavaju unesene vrijednoti");
		db.odsjek_predmet.findAll({
			where: {
				idOdsjek: body.idOdsjek,
				semestar: body.semestar,
				godina: GOD,
				obavezan: body.obavezan
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