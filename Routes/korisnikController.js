const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();
var validacija = require('./validacija.js')();

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

    await db.Odsjek.findOne({where:{naziv:body.idOdsjek}}).then(odsjek =>{
        body.idOdsjek = odsjek.idOdsjek;
        console.log('Odjsek'+odsjek.idOdsjek);
    })
    
  
    date = body.datumRodjenja.substring(0,10);
    body.datumRodjenja = date;
    console.log('datum :'+date);
    console.log(body);


    //validacija
   await db.Korisnik.findOne({where:{JMBG:body.JMBG}}).then(prof => {
    if(prof != null) {
        console.log('profa'+prof);
        return res.status(400).send({message: 'Postoji korisnik sa istim JMBG!'});
    }   
})

    var duzine = await validacijaStringova(req.body);
    console.log(duzine);
    var provjera = await validacijaPodataka(body);    
    console.log(provjera);
    var dr = await validacijaDatumaRodjenja(body.datumRodjenja);    
    console.log(dr);
    var dj = await provjeriDatumJmbg(body.datumRodjenja,body.JMBG);    
    console.log(dj);
    if(duzine != 'Ok') return res.status(400).send({message: duzine});
    else if(provjera != 'Ok') return res.status(400).send({message: 'Greska:'+provjera});
    else if(!dr) return res.status(400).send({message: 'Neispravan datum rodjenja!'});
    else if(!dj) return res.status(400).send({message: 'JMBG i datum rodjenja se ne poklapaju'});
     



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
            await db.Korisnik.create(body);   
            console.log("tu");   
           return res.status(200).send({message: "Uspješno dodan korisnik " + body.username});
          
        }
    }
    ajax.open('GET', 'http://localhost:31901/api/korisnik/GetLoginDataForProfessor?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
});
module.exports = korisnikRouter;