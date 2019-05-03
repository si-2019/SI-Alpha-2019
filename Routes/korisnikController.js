const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();
//var validacija = require('./validacija.js');

//generisanje username-a i passworda za profesora
korisnikRouter.get('/GetLoginDataForProfessor',function(req,res){
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    res.contentType('application/json');   
    var userName = ime + '.'+ prezime;
    userName = userName.toLowerCase();
    console.log(userName);

    db.Korisnik.findAll({where:{ime:ime,prezime:prezime}}).then(data => {
        var brojDuplikata = data.length;
        console.log(brojDuplikata);
        userName += ++brojDuplikata;
        var password = generator.generate({
        length: 8,
        numbers: true
        });
        res.end(JSON.stringify({
            username: userName,
            password: password
        }));                
              
    })
    .catch(err => {
        console.log("GRESKA: " + err);
        res.end(err);
    });
})

//dodavanje profesora u bazu
korisnikRouter.post('/AddNewProfessor',function(req,res) {
    let body = req.body;
    if(!body.spol || !body.ime || !body.prezime) {
        res.status(400).end("Neispravan foramt");
    }

    db.Odsjek.findOne({where:{naziv:body.idOdsjek}}).then(odsjek =>{
        body.idOdsjek = odsjek.idOdsjek;
        console.log('Odjsek'+odsjek.idOdsjek);
    })
    var parts = body.datumRodjenja.split('-');
    var date = new Date(parts[0], parts[1] - 1, parts[2]); 
    
    body.datumRodjenja = date;
    console.log(body);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            var data = JSON.parse(ajax.responseText);
            console.log(data);
            if(body.spol.toLowerCase() == 'musko' || body.spol.toLowerCase() == 'muško')
                body.spol = 1;            
            else if(body.spol.toLowerCase() == 'zensko' || body.spol.toLowerCase() == 'žensko')
                body.spol = 0;

            body.JMBG = body.jmbg;
            body.idUloga = 3;
            body.username = data.username;
            body.password = md5(data.password);
            body.indeks = null;
            db.Korisnik.create(body);   
            console.log("tu");   
            res.end("Uspješno dodan korisnik " + body.username);
          
        }
    }
    ajax.open('GET', 'http://localhost:31901/api/korisnik/GetLoginDataForProfessor?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
});
module.exports = korisnikRouter;