const express = require('express');
const deleteRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();

//brisanje predmeta po nazivu
//link : http://localhost:31901/api/predmet/deleteSubject?naziv=test Predmet za brisanje 4
deleteRouter.delete('/deleteSubject', function(req,res) {
    db.Predmet.findAll({where: {naziv: req.query.naziv}}).then( predmet => {
        res.contentType('application/json');
        if(predmet != []) {
        db.Predmet.destroy({where: {naziv: req.query.naziv}}).then( function(rowDeleted){
            if(rowDeleted == 1) {
                res.status(200).send({message: 'Uspjesno obrisan predmet'})
            }
            else {            
            res.status(400).send({message: 'Ne postoji predmet sa tim nazivom'})
            }
        }, function(err) {
            console.log(err);
        })   
    }
   
})
})

module.exports = deleteRouter;