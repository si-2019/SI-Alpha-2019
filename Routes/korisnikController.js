const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();
require('./validacija.js')();


//brisanje predmeta po nazivu
//link : http://localhost:31901/api/korisnik/deleteSubject?naziv=test Predmet za brisanje 4
korisnikRouter.delete('/deleteSubject', function(req,res) {
    console.log(req.query.naziv);
    db.Predmet.findAll({where: {naziv: req.query.naziv}}).then( predmet => {
        console.log(predmet);
        res.contentType('application/json');
        if(predmet != []) {
        db.Predmet.destroy({where: {naziv: req.query.naziv}}).then( function(rowDeleted){
            if(rowDeleted == 1) {
                console.log('Uspjesno obrisano');
                res.status(200).send({message: 'Uspjesno obrisan predmet'})
            }
            else {
            
            res.status(400).send({message: 'Ne postoji predmet sa tim nazivom'})
            }
        }, function(err) {
            console.log(err);
        })
        } 
        else {
            res.status(400).send('Ne postoji predmet sa tim nazivom')
        }
    })
   
})

module.exports = korisnikRouter;