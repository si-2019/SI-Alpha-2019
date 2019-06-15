const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

require('../../Funkcije/validacija.js')();
require('../../Funkcije/autorizacija.js')();
require('../../Funkcije/validateToken.js')();

odsjekRouter.post('/AddNewOdsjek', async function(req, res){
	res.contentType('application/json');
	var currentUser = req.query.currentUsername;
	var currentToken = req.query.token;
	console.log(currentUser);

    if(!currentUser) return res.status(400).end(JSON.stringify({message: "Nije poslan username korisnika"}));

    var auth = await autentifikacijaAdmin(currentUser,currentToken);
    console.log(auth);
	if(!auth) return res.send("Nemate privilegije");
	
	console.log("Provjera validnosti imena") ;
	let body = req.body;
	//U slučaju da je uneseno prazno ime, vraca gresku
	if(!body.naziv || body.naziv.length>25){
		res.status(400).end(JSON.stringify({message: "Neispravno ime"}));
	}
	else{
		console.log("Pretražuje bazu podataka");
	//Pretrazuje da li ima vec isto ime u bazi
		await db.Odsjek.findAll({
			where:{
				naziv: String(body.naziv)
			}
		})
		.then(data => {
			console.log("Pokusaj dodavanja odsjeka");
			if(data.length!=0){
				return res.status(400).end(JSON.stringify({message: "Odsjek je vec u bazi"}));
			}
	//Dodaje u bazi odsjek
			else{
				db.Odsjek.create({naziv: body.naziv})
				.then(odsjek => {
					console.log("Dodano u bazi podataka\n");
					res.status(200).end(JSON.stringify(odsjek));
				});
			}
		});
	}

});

module.exports = odsjekRouter;
