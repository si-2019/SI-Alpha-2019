const express = require('express');
const povezivanjeRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();

//link: http://localhost:31901/api/povezivanje/linkSubjectStudent
povezivanjeRouter.post('/linkSubjectStudent', function(req,res) {
    var idPredmeta = req.body.idPredmet.toString();
    var idStudenta = req.body.idStudent.toString();
    res.contentType('application/json');
    
    
    if(idStudenta.length > 10) {
        res.status(400).send({message: 'ID vezan za studenta ima više od 10 cifri'})
    }
    else if(idPredmeta.length > 10) {
        res.status(400).send({message: 'ID vezan za predmet ima više od 10 cifri'})
     
    }
    else {
        db.Korisnik.findOne({where: {id: idStudenta, idUloga:1}}).then( korisnik => {
            if(korisnik == null) {
                res.status(400).send({message: 'Student ne postoji'});
            }
            else {
            db.Predmet.findOne({where: {id:idPredmeta}}).then( predmet => {
                if(predmet == null) {
                    res.status(400).send({message: 'Predmet ne postoji'});
                }
                else {
                    predmet.update({idStudent:idStudenta});
                    res.status(200).send({message: 'Uspjesno dodana veza predmet-student'});
                }
            })
        }
        })
    }

  
})

module.exports = povezivanjeRouter;