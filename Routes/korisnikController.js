"use strict";
const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 
require('./validacija.js')();

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();

//editovanje podataka za profesora
//http://localhost:31901/api/korisnik/editProfessor
// body x-www-form-urlencoded
korisnikRouter.put('/editProfessor', async function(req,res) {
    
    var podaci =  req.body;
    res.contentType('application/json');
    await db.Korisnik.findOne({where:{username: req.body.username}}).then( async function(prof) {
        if(!prof) {
            return res.status(400).send({message: 'Profesor se ne nalazi u bazi'});
        }
        else {
             //validacija
             var duzine = await validacijaStringova(req.body);
             console.log(duzine);
             var provjera = await validacijaPodataka(req.body);    
             console.log(provjera);
             try{
            await db.Korisnik.findOne({where:{JMBG:req.body.JMBG}}).then( prof => {
                if(prof != null && prof.username != req.body.username) {
                console.log('profa'+prof);
                return res.status(400).send({message: 'Postoji korisnik sa istim JMBG!'});
                }   
            })
        }catch(err) {
            console.error(err);
        }
             var dr = await validacijaDatumaRodjenja(req.body.datumRodjenja);    
             console.log(dr);
             var dj = await provjeriDatumJmbg(req.body.datumRodjenja, req.body.JMBG);    
             console.log(dj);
           

           
            if(duzine != 'Ok') return res.status(400).send({message: duzine});
            else if(provjera != 'Ok') return res.status(400).send({message :'Greska:'+provjera});
            else if(!dr) return res.status(400).send({message: 'Neispravan datum rodjenja!'});
            else if(!dj) return res.status(400).send({message: 'JMBG i datum rodjenja se ne poklapaju'});
            else {
            //json kao u pretraga liste
       try{
            await db.Odsjek.findOne({where: {naziv: req.body.odsjek}}).then( function(odsjek) {
                var json = {
                    idOdsjek: odsjek.idOdsjek, 
                    ime: podaci.ime, 
                    prezime: podaci.prezime, 
                    datumRodjenja: podaci.datumRodjenja, 
                    JMBG: podaci.JMBG, 
                    email: podaci.email,
                    mjestoRodjenja: podaci.mjestoRodjenja,
                    kanton: podaci.kanton,
                    drzavljanstvo: podaci.drzavljanstvo,
                    telefon: podaci.telefon,
                    spol: parseInt(podaci.spol),  //musko zensko
                    imePrezimeMajke: podaci.imePrezimeMajke,
                    imePrezimeOca: podaci.imePrezimeOca,
                    adresa: podaci.adresa,
                    username: podaci.username,
                    //password:null
                    linkedin: podaci.linkedin,
                    website: podaci.website,
                    titula: podaci.titula};
                    prof.update(json);
                    console.log('de pls');
                    return res.status(200).send({message: 'Uspjesno azurirane informacije o profesoru'})
        })
    }catch(err) {
        console.error(err);
    }
    }
    }
    })
})


module.exports = korisnikRouter;