const express = require('express');
const povezivanjeRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();


povezivanjeRouter.post('/linkProfessorSubject', function(req,res) {
    var idPredmeta = req.body.idPredmet.toString();
    var idProfesora = req.body.idProfesor.toString();
    res.contentType('application/json');
    
    //hocel bit string sa frontenda
    
    if(idProfesora.length > 10) {
        res.status(400).send({message: 'ID vezan za profesora ima više od 10 cifri'})
    }
    else if(idPredmeta.length > 10) {
        res.status(400).send({message: 'ID vezan za predmet ima više od 10 cifri'})
     
    }
    else {
       


    db.Korisnik.findOne({where: {id: idProfesora, idUloga:3}}).then( korisnik => {
        if(korisnik == null) {
            res.status(400).send({message: 'Profesor ne postoji'});
        }
        else {
        db.Predmet.findOne({where: {id:idPredmeta}}).then( predmet => {
            if(predmet == null) {
                res.status(400).send({message: 'Predmet ne postoji'});
            }
            else {
            predmet.update({idProfesor:idProfesora});
            res.status(200).send({message: 'Uspjesno dodana veza predmet-profesor'});
            }
        })
    }
    })
}
    /*.catch(function(err){
        res.status(400).end(JSON.stringify({message: "Nije se mogao naci"}));
        });*/

  
})

module.exports = povezivanjeRouter;