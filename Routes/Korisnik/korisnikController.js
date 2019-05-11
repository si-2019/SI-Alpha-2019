const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();


//brisanje predmeta po nazivu
//link : http://localhost:31901/api/korisnik/deleteSubject?naziv=test Predmet za brisanje 4
korisnikRouter.delete('/deleteSubject', function(req,res) {
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

korisnikRouter.post('/AddNewStudent', async function(req,res) {
    let body = req.body;

    // Prilagodjavanje imenovanja
    if(!body.datumRodjenja) body.datumRodjenja = body.datum;
    if(!body.JMBG) body.JMBG = body.jmbg;
    if(!body.mjestoRodjenja) body.mjestoRodjenja = body.mjesto;

    // Validacija
    // await db.Korisnik.findOne({where:{JMBG: body.jmbg}}).then(korisnik => {
    //     if(korisnik != null) {
    //         return res.status(400).end('Postoji korisnik sa istim JMBG!');
    //     }   
    // })

    var provjera = await validacijaPodataka(body);    
    console.log(provjera);
    var dr = await validacijaDatumaRodjenja(body.datumRodjenja);    
    var dj = await provjeriDatumJmbg(body.datumRodjenja,body.JMBG);    
    if(provjera != 'Ok') return res.status(400).end('Greska: '+provjera);
    else if(!dr) return res.status(400).end('Neispravan datum rodjenja!');
    else if(!dj) return res.status(400).end('JMBG i datum rodjenja se ne poklapaju');
    
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            var data = JSON.parse(ajax.responseText);
            console.log(data);
            if(body.spol.toLowerCase() == 'musko' || body.spol.toLowerCase() == 'muško')
                body.spol = 1;            
            else 
				body.spol = 0;
            body.semestar = 1;
            body.JMBG = body.jmbg;
            body.datumRodjenja = body.datum;
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
    
});

korisnikRouter.post('/AddNewAssistant', async function(req,res) {
    let body = req.body;

    // Prilagodjavanje imenovanja
    if(!body.datumRodjenja) body.datumRodjenja = body.datum;
    if(!body.JMBG) body.JMBG = body.jmbg;
    if(!body.mjestoRodjenja) body.mjestoRodjenja = body.mjesto;

    var provjera = await validacijaPodataka(body);    
    console.log(provjera);
    var dr = await validacijaDatumaRodjenja(body.datumRodjenja);    
    var dj = await provjeriDatumJmbg(body.datumRodjenja,body.JMBG);    
    if(provjera != 'Ok') return res.status(400).end('Greska: '+provjera);
    else if(!dr) return res.status(400).end('Neispravan datum rodjenja!');
    else if(!dj) return res.status(400).end('JMBG i datum rodjenja se ne poklapaju');
    
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
            body.datumRodjenja = body.datum;
            body.idUloga = 2;
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
    
});

global.JsonNiz = async function(korisnici,res) {
  
    var niz = [];
    for(var el in korisnici) {
       await db.Odsjek.findOne({where: {idOdsjek: korisnici[el].idOdsjek}}).then( odsjek => {
            var json = {
                odsjek: odsjek.naziv, 
                ime: korisnici[el].ime, 
                prezime: korisnici[el].prezime, 
                datumRodjenja: korisnici[el].datumRodjenja, 
                JMBG: korisnici[el].JMBG, 
                email: korisnici[el].email,
                mjestoRodjenja: korisnici[el].mjestoRodjenja,
                kanton: korisnici[el].kanton,
                drzavljanstvo: korisnici[el].drzavljanstvo,
                telefon: korisnici[el].telefon,
                spol: korisnici[el].spol,  //musko zensko
                imePrezimeMajke: korisnici[el].imePrezimeMajke,
                imePrezimeOca: korisnici[el].imePrezimeOca,
                adresa: korisnici[el].adresa,
                username: korisnici[el].username,
                //password:null
                linkedin: korisnici[el].linkedin,
                website: korisnici[el].website,
                titula: korisnici[el].titula};
            niz.push(json);
        })
       
       }      
      
       if(niz.length != 0) {
         res.write(JSON.stringify(niz));  
         return res.end();
       }
       else {
        return res.status(400).send({message: 'Ne postoji u sistemu'});
        }
}

//pretraga profesora 
// link: http://localhost:31901/api/korisnik/searchProfessor?ime=Amer
korisnikRouter.get('/searchProfessor', function(req,res){
    res.contentType('application/json');
    if(req.query.ime != null && req.query.ime != '' && req.query.prezime != null && req.query.prezime != '') { // ime i prezime
        db.Korisnik.findAll({where: {idUloga: 3, ime: req.query.ime, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.ime != null && req.query.ime != '') { //ime
       db.Korisnik.findAll({where: {idUloga: 3, ime: req.query.ime}}).then( korisnici => {
           JsonNiz(korisnici,res);
       })
    }
    else if(req.query.prezime != null && req.query.prezime != '') { //prezime
        db.Korisnik.findAll({where: {idUloga: 3, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.username != null && req.query.username != '') { //username
        db.Korisnik.findAll({where: {idUloga: 3, username: req.query.username}}).then( korisnici => {
            JsonNiz(korisnici,res);      
           
        })
    }
})


module.exports = korisnikRouter;
