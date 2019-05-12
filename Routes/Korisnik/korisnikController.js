const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();


korisnikRouter.post('/updateStudent', function(req,res) {
    res.contentType('application/json');
    let body = req.body;
    if(!body.id)  return res.status(400).end(JSON.stringify({message: "Nije poslan id!"}));
    if(body.id.toString().length > 10) return res.status(400).end(JSON.stringify({message: "Id je predugacak!"}));
    if(!parseInt(body.id)) return res.status(400).end(JSON.stringify({message: "Nevalidan id!"}));

    if(!body.ime || !body.prezime || body.ime == '' || body.prezime == '') return res.status(400).end(JSON.stringify({message: "Nisu uneseni svi obavezni podaci!"}));
    if(body.ime.length > 50 || body.prezime.length > 50 || ((body.email && body.email.length > 50) || (body.telefon && body.telefon.length > 50) || (body.adresa && body.adresa.length > 50) || (body.telefon && body.telefon.length > 50)))
      return res.status(400).end(JSON.stringify({message: "Podaci su predugacki!"}));

    db.Korisnik.findOne({where:{id: body.id, idUloga: 1}})
    .then(student => {
        if(!student) return res.status(400).end(JSON.stringify({message: "Odabrani student ne postoji!"}));
        else {
        return student.update({
            ime: body.ime,
            prezime: body.prezime,
            email: body.email,
            telefon: body.telefon,
            adresa: body.adresa,
            indeks: body.indeks
        }).then( () => {
           return res.status(200).end(JSON.stringify({message: "Student uspjesno azuriran!"}));
        }).catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do greske!"}));
        })
    }
     
    })
    .catch(err => {
        console.log(err);
         res.status(500).end(JSON.stringify({message: "Doslo je do greske!"}));
    });
    
})

korisnikRouter.get('/GetNewPassword',function(req,res){
    var userName = req.query.username;
    res.contentType('application/json');  
  
        var password = generator.generate({
        length: 8,
        numbers: true
        });
        var pas = password;
        password = md5(password);


        db.Korisnik.findOne({where:{username:userName}}).then(korisnik => {
            if(korisnik != null) {
                //console.log('profa'+prof);
                korisnik.update({
                    password:password
                })
                res.status(200).send({password:pas});
            }
            else {
                res.status(400).send({message: 'Ne postoji korisnik sa tim usernameom'})
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
                id: korisnici[el].id,
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

//Pretraga studenata
korisnikRouter.get('/searchStudent', function(req,res){
    res.contentType('application/json');
    if(req.query.ime != null && req.query.ime != '' && req.query.prezime != null && req.query.prezime != '') { // ime i prezime
        db.Korisnik.findAll({where: {idUloga: 1, ime: req.query.ime, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.ime != null && req.query.ime != '') { //ime
       db.Korisnik.findAll({where: {idUloga: 1, ime: req.query.ime}}).then( korisnici => {
           JsonNiz(korisnici,res);
       })
    }
    else if(req.query.prezime != null && req.query.prezime != '') { //prezime
        db.Korisnik.findAll({where: {idUloga: 1, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.username != null && req.query.username != '') { //username
        db.Korisnik.findAll({where: {idUloga: 1, username: req.query.username}}).then( korisnici => {
            JsonNiz(korisnici,res);      
           
        })
    }
})

module.exports = korisnikRouter;
