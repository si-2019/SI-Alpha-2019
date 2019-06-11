const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


korisnikRouter.get('/getPredmetiAsisProf', function(req,res) {
res.contentType('application/json');
var idKorisnik = req.query.idKorisnik;
var Uloga = req.query.Uloga;
if(!parseInt(idKorisnik) || !parseInt(Uloga)){
	console.log("Hi mom");
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
if(Uloga == 2 || Uloga == 3){
		db.Korisnik.findOne({where:{id:idKorisnik, idUloga:Uloga}}).then(korisnik => {
			if(!korisnik) res.status(400).send({message:'Ne postoji korisnik sa tim id-em u odabranoj ulozi'});
			else {
				if(Uloga == 2){
					db.Predmet.findAll({where:{idAsistent:korisnik.id}}).then(predmet => {
						res.status(200).send(predmet);
					})     
				}
				else if(Uloga == 3){
					db.Predmet.findAll({where:{idProfesor:korisnik.id}}).then(predmet => {
						res.status(200).send(predmet);
					}) 
				}
			}
		})
	}
else{
	res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
}
})

module.exports = korisnikRouter;