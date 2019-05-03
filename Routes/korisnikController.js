const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();
const Op = db.Sequelize.Op;

korisnikRouter.get('/GetLoginDataForProfessor',function(req,res){
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    res.contentType('application/json');   
    var userName = ime + '.'+ prezime;
    userName = userName.toLowerCase();
    console.log(userName);
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
module.exports = korisnikRouter;