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

let predmet = {
    id: 1,
    naziv: 'RPP',
    ects: 5,
    brojPredavanja: 20,
    brojVjezbi: 10,
    opis: 'testni predmet'
}

let as = 
    { 
        "id": 36,
        "idOdsjek": 1,
        "idUloga": 3,
        "ime": "Almir",
        "prezime": "Karabegović",
        "datumRodjenja": "1975-06-22",
        "JMBG": "2206975842818",
        "email": "almir.karabegovic@etf.unsa.ba",
        "mjestoRodjenja": "Zenica",
        "kanton": "Zeničko-Dobojski kanton",
        "drzavljanstvo": "BiH",
        "telefon": "+38761525926",
        "spol": false,
        "imePrezimeMajke": "Fatima Marić",
        "imePrezimeOca": "Nesib Karabegović",
        "adresa": "Zmaja od Bosne 29",
        "username": "almir.karabegovic1",
        "linkedin": "https://ba.linkedin.com/in/almir",
        "website": null,
        "titula": null
   
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

test.get('/unesi', function(req,res) {
    db.Korisnik.create(as).then( () => {
        res.status(200).send('Uspjesno dodan')
    }).catch( err => {
        console.log(err);
        res.status(400).send('Greska vec postoji profesor sa tim IDem')
    })
    })

 test.get('/unesiAsistenta', function(req,res) {
     as.id = 241;
     as.idUloga = 2;
    db.Korisnik.create(as).then( () => {
        res.status(200).send('Uspjesno dodan')
    }).catch( err => {
        console.log(err);
        res.status(400).send('Greska vec postoji asistent sa tim IDem')
    })
    })  


module.exports = test;
