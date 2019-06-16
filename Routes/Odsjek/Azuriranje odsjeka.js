const express = require('express');
const OdsjekRouter = express.Router();

const db = require('../../models/db.js');
db.sequelize.sync();

//Nade se odsjek u bazi i salje se frontend dijelu za izmjenu podataka
//http://localhost:31901/api/odsjek/GetOdsjek?naziv=naziv_odsjek
OdsjekRouter.get('/GetOdsjek', function(req, res){
	res.contentType('application/json');
	//npm instal jQuery
//npm install jsdom

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

	var username = req.query.currentUsername;
	var token = decodeURIComponent(req.query.token);

$.ajax({
                    url: 'https://si2019romeo.herokuapp.com/users/validate',
                    type: 'get',
                    dataType: 'json',
                    data: jQuery.param({
                        username: username
                    }),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    complete: function (response) {
                        if(response.status==200) {
                        var ajax2 = new XMLHttpRequest();
							ajax2.onreadystatechange = function() {
								if(ajax2.readyState == 4 && ajax2.status == 200) {
									console.log(ajax2.responseText);
									if(ajax2.responseText == "true") {										
										//radi normalno servis
										var naziv = decodeURIComponent(req.query.naziv);
										console.log("Primio se zahtjev za slanje odabranog odsjeka");
										db.Odsjek.findOne({where:{naziv: naziv}})
										.then(data => {
												if(!data){
												console.log("Odsjek nije u bazi");
												res.status(400).end(JSON.stringify({message: "Odsjek nije u bazi"}));
														}
												else{
												//data sadrzi odsjek, pretvara se u JSON i šalje
													console.log("Vraca se odsjek\n");
													res.status(200).end(JSON.stringify(data));
												}
											});
									} 
									else return res.send("Nemate privilegije")
								}
								else if(ajax2.readyState == 4) {
									return res.send("Nemate privilegije")
									}
							}
						ajax2.open('GET', 'https://si2019oscar.herokuapp.com/pretragaUsername/imaUlogu/' + username + '/admin', true);
						ajax2.setRequestHeader('Content-Type','application/json');
						ajax2.send();    
                    } 
						else return res.send("Nemate privilegije")
                    }
});
	
});

OdsjekRouter.post('/PromijeniOdsjek', function(req, res){
	res.contentType('application/json');
	console.log("Provjera validnosti unesenih vrijednosti");
	//npm instal jQuery
//npm install jsdom

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

	var username = req.query.currentUsername;
	var token = decodeURIComponent(req.query.token);

$.ajax({
                    url: 'https://si2019romeo.herokuapp.com/users/validate',
                    type: 'get',
                    dataType: 'json',
                    data: jQuery.param({
                        username: username
                    }),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", token);
                    },
                    complete: function (response) {
                        if(response.status==200) {
                        var ajax2 = new XMLHttpRequest();
							ajax2.onreadystatechange = function() {
								if(ajax2.readyState == 4 && ajax2.status == 200) {
									console.log(ajax2.responseText);
									if(ajax2.responseText == "true") {
										//radi normalno servis
										let body = req.body;
										//U slucaju da su uneseni prazne vrijednosti, vraca gresku
										if(!parseInt(body.idOdsjek)){
											return res.status(400).end(JSON.stringify({message: "Nevalidan id!"}));
										}
										if(!body.idOdsjek || !body.naziv || body.naziv.length>25){
											res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
										}
										else{
											console.log("Pretražuje bazu podataka");
										//Pretrazuje da li ima odsjek u bazi
											db.Odsjek.findByPk(body.idOdsjek)
											.then(data => {
												if(!data){
													console.log("Odsjek nije u bazi");
													res.status(400).end(JSON.stringify({message: "Odsjek nije u bazi"}));
												}
												else{
													console.log("Pokusaj izmjene odsjeka");
													data.update({
														naziv: body.naziv
													});
													console.log("Uspješno izmjenjen odsjek\n");
													res.status(200).end(JSON.stringify(data));
												}
											});
										}
									} 
									else return res.send("Nemate privilegije")
								}
								else if(ajax2.readyState == 4) {
									return res.send("Nemate privilegije")
								}
							}
						ajax2.open('GET', 'https://si2019oscar.herokuapp.com/pretragaUsername/imaUlogu/' + username + '/admin', true);
						ajax2.setRequestHeader('Content-Type','application/json');
						ajax2.send();    
                    } 
						else return res.send("Nemate privilegije")
                    }
});
	
});

module.exports = OdsjekRouter;
