//hardkodirani unos za test

const express = require('express');
const test = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();

let profesor = {
    id: 3,
    idOdsjek: 1,
    idUloga: 3,    
    ime:'Zulfikar',
    prezime: 'Teskic',
    datumRodjenja: '1911-01-01',
    JMBG: '0101911175070',
    email: 'malalala.com',
    mjestoRodjenja: 'Travnik',
    kanton: 'SBK',
    drzavljanstvo: 'BiH',
    telefon: '062/033-033',
    spol: 1,
    imePrezimeMajke: 'Fatima Aktic',
    imePrezimeOca: 'Meho Pasic',
    adresa: 'Gornja Maoca',
    username: 'amer.pasic2',
    linkedin: 'prof.com',
    website: 'prof_muha.com',
    titula: 'red'
}

//ako vec postoji u bazi, test ce past
test.get('/upisiProfesora', function(req,res) {
db.Korisnik.create(profesor).then( () => {
    res.status(200).send('Uspjesno dodan')
}).catch( err => {
    console.log(err);
    res.status(400).send('Greska vec postoji korisnik sa tim IDem')
})
})


module.exports = test;
