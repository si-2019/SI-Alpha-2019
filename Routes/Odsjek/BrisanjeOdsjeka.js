const express = require('express');
const odsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

//http://localhost:31901/api/odsjek/DeleteOdsjek?naziv=naziv_odsjek
odsjekRouter.delete('/DeleteOdsjek', function(req, res){
	res.contentType('application/json');
	var naziv = decodeURIComponent(req.query.naziv);
	console.log("Primio se zahtjev za brisanje odsjeka");
	db.Odsjek.destroy({where: {naziv: naziv}})
	.then(function(rowDeleted){
        if(rowDeleted == 1) {
			console.log("sdf");
            res.status(200).send({message: 'Odsjek je obrisan'})
        }
        else {     
            res.status(400).send({message: 'Odsjek nije u bazi'})
        }
    }, function(err) {
            console.log(err);
        })
});

module.exports = odsjekRouter;