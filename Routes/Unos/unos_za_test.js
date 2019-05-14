
const express = require('express');
const test = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();

let predmet = {
    id: 1,
    naziv: 'RPP',
    ects: 5,
    brojPredavanja: 20,
    brojVjezbi: 10,
    opis: 'testni predmet'
}

//ako vec postoji u bazi, test ce past
test.get('/unesiPredmet', function(req,res) {
db.Predmet.create(predmet).then( () => {
    res.status(200).send('Uspjesno dodan')
}).catch( err => {
    console.log(err);
    res.status(400).send('Greska vec postoji predmet sa tim IDem')
})
})


module.exports = test;
