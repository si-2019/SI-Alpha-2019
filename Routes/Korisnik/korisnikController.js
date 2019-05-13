const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();


const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();

//generisanje username-a i passworda za profesora
// link: http://localhost:31901/api/korisnik/GetLoginDataForProfessor?ime=Nemanja&prezime=Nemanjovic
korisnikRouter.get('/GetLoginDataForProfessor',function(req,res){
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    res.contentType('application/json');  
    if(!ime || !prezime) res.status(400).send({message: 'Unesite ime/prezime'});
         
  
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
        res.status(200).send(JSON.stringify({
            username: userName,
            password: password
        }));                
              
    })
    .catch(err => {
        console.log("GRESKA: " + err);
        res.send(err);
    });
})

//dodavanje profesora u bazu
// link http://localhost:31901/api/korisnik/AddNewProfessor
/* test za postmana
idOdsjek:RI
idUloga:2
ime:Melkom
prezime:Avti
datumRodjenja:1993-04-05
JMBG:0504993175070
email:h@gm.com
mjestoRodjenja:Travnik
kanton:SBK
drzavljanstvo:BiH
telefon:062/033-033
spol:musko
imePrezimeMajke:Fatima Aktic
imePrezimeOca: Meho Amsovic
adresa:Gornji Hrast
username:null
password:null
linkedin:prof.com
website:prof_muha.com
titula:red*/
korisnikRouter.post('/AddNewProfessor', async function(req,res) {
    let body = req.body;
    res.contentType('application/json');   

    await db.Odsjek.findOne({where:{naziv:body.odsjek}}).then(odsjek =>{
        return body.idOdsjek = odsjek.idOdsjek;        
    })    
  
    date = body.datumRodjenja.substring(0,10);
    body.datumRodjenja = date;

    //validacija        
    
    var duzine = await validacijaStringova(req.body);
    console.log(duzine);
    var provjera = await validacijaPodataka(body);    
    console.log(provjera);
    var dr = await validacijaDatumaRodjenja(body.datumRodjenja);    
    console.log(dr);
    var dj = await provjeriDatumJmbg(body.datumRodjenja,body.JMBG);    
    console.log(dj);   

    if(duzine != 'Ok') return res.status(400).send({message: duzine});
    else if(provjera != 'Ok') return res.status(400).send({message: provjera});
    else if(!dr) return res.status(400).send({message: 'Neispravan datum rodjenja!'});
    else if(!dj) return res.status(400).send({message: 'JMBG i datum rodjenja se ne poklapaju'});
    else {
         //pomjereno radi testova 
        await db.Korisnik.findOne({where:{JMBG:body.JMBG}}).then(prof => {
            if(prof != null) {
                console.log('profa'+prof);
                return res.status(400).send({message: 'Postoji korisnik sa istim JMBG!'});
            }   
        })

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = async function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            var data = JSON.parse(ajax.responseText);
            console.log(data);
            if(body.spol.toLowerCase() == 'musko' || body.spol.toLowerCase() == 'muško')
            body.spol = 1;            
            else if(body.spol.toLowerCase() == 'zensko' || body.spol.toLowerCase() == 'žensko')
            body.spol = 0;
         
            body.idUloga = 3;
            body.username = data.username;
            body.password = md5(data.password);
            await db.Korisnik.create(body).then( () => {
                console.log("tu");   
                return res.status(200).send({message: "Uspješno dodan profesor"});
            });   
           
          
        }
    }
    ajax.open('GET', 'http://localhost:31901/api/korisnik/GetLoginDataForProfessor?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
    }
});

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
