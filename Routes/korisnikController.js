const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();
const Op = db.Sequelize.Op;

korisnikRouter.get('/GetLoginData',function(req,res) {
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    res.contentType('application/json');  

    if(!ime || !prezime) {
        res.status(400).end(JSON.stringify({message: "Unesite ime/prezime"}));
    }
    else {     
        var userName = ime[0] + prezime;
        userName = userName.toLowerCase();
        db.Korisnik.findAll({
            where:{
                username: {
                    [Op.like]: `${userName}%`
                }
            },
            attributes:['username']
            
        })
        .then(data => {
            var brojDuplikata = data.length;
            userName += ++brojDuplikata;
            var password = generator.generate({
            length: 8,
            numbers: true
            });
        
            db.Korisnik.max('indeks')
                .then(data => {
                    var indeks = parseInt(data) + 1;
                    res.end(JSON.stringify({
                        username: userName,
                        password: password,
                        indeks: indeks
                    }));
                })
                .catch(err => {
                    res.end(err);
                });        
        })
        .catch(err => {
            console.log("GRESKA: " + err);
            res.end(err);
        });
    }
})

korisnikRouter.post('/AddNewStudent',function(req,res) {
    let body = req.body;
    if(!body.spol || !body.ime || !body.prezime) {
        res.status(400).end("Neispravan foramt");
    }
    else{
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4 && ajax.status == 200) {
                var data = JSON.parse(ajax.responseText);
                console.log(data);
                if(body.spol.toLowerCase() == 'musko' || body.spol.toLowerCase() == 'muško')
                    body.spol = 1;            
                else 
	    			body.spol = 0;

                body.JMBG = body.jmbg;
                body.idUloga = 1;
                body.username = data.username;
                body.password = md5(data.password);
                body.indeks = data.indeks;
                db.Korisnik.create(body);      
                res.end("Uspješno dodan korisnik " + body.username);
            
            }
        }
        ajax.open('GET', 'http://localhost:31901/api/korisnik/GetLoginData?ime=' + body.ime + '&prezime=' + body.prezime, true);
        ajax.setRequestHeader('Content-Type','application/json');
        ajax.send();  
    }
});

module.exports = korisnikRouter;