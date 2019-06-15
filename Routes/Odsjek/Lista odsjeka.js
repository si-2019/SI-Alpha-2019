const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

require('../../Funkcije/validacija.js')();
require('../../Funkcije/autorizacija.js')();
require('../../Funkcije/validateToken.js')();

odsjekRouter.get('/GetOdsjeci', async function(req, res){
	res.contentType('application/json');
	var currentUser = req.query.currentUser;

    if(!currentUser) return res.status(400).end(JSON.stringify({message: "Nije poslan username korisnika"}));

    var auth = await autorizacijaAdmin(currentUser);
    console.log(auth);
    if(!auth) return res.send("Nemate privilegije");
	console.log("Pretražuje bazu podataka");
	await db.Odsjek.findAll({
    })
    .then(data => {
		//data sadrzi listu odsjeka, pretvara se u JSON i šalje
		console.log("Vraća se lista odsjeka\n");
		return res.status(200).end(JSON.stringify(data));
	});
});

module.exports = odsjekRouter;