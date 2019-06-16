const express = require('express');
const korisnikRouter = express.Router();

var generator = require('generate-password');
var md5 = require('md5'); 

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();

const Op = db.Sequelize.Op;
require('../../Funkcije/validacija.js')();
require('../../Funkcije/autorizacija.js')();
require('../../Funkcije/validateToken.js')();

korisnikRouter.delete('/deleteStudent', function(req,res) {
    res.contentType('application/json');
    var idStudenta = req.query.id;
    
    if(!idStudenta || idStudenta == undefined || idStudenta == null) return res.status(400).end(JSON.stringify({message: 'ID nije poslan'}))
    db.Korisnik.destroy({where: {id: idStudenta,idUloga:1}})
    .then( function(rowDeleted) {
        if(rowDeleted == 1) return res.status(200).end(JSON.stringify({message: 'Uspjesno obrisan student'}))
        else return res.status(400).end(JSON.stringify({message: 'Ne postoji taj student'}))
        })
    .catch( err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: 'Doslo je do interne greske'}))
    })  
})

korisnikRouter.delete('/deleteAssistant', function(req,res) {
res.contentType('application/json');
var idAsistenta = req.query.id;
db.Korisnik.findOne({where:{id:idAsistenta, idUloga:2}}).then(asistent => {
    if(!asistent) res.status(404).send({message:'Ne postoji asistent sa tim id-em'});
    else {
            db.Korisnik.destroy({where:{id:idAsistenta}}).then( op => {
                res.status(200).send({message: 'Obrisan iz baze'});    
            })        
    }
})
})



korisnikRouter.delete('/deleteProfessor', function(req,res) {
    res.contentType('application/json')
    var idProfesora = req.query.id;
    if(!idProfesora || idProfesora == undefined || idProfesora == null) return res.status(400).send({message: 'ID nije poslan'})
              
    db.Korisnik.destroy({where: {id: idProfesora,idUloga:3}}).then( function(rowDeleted){
            console.log('tu')
                if(rowDeleted == 1) {
                return res.status(200).send({message: 'Uspjesno obrisan profesor'})
                }
                else {            
                return res.status(400).send({message: 'Ne postoji taj profesor'})
                }
            }).catch( err => {
                console.log(err);
            })    
   
})


korisnikRouter.get('/getAllStudents', function(req,res) {
    res.contentType('application/json');
    console.log('tu')
    db.Korisnik.findAll({where:{idUloga:1}}).then( lista => {
        res.status(200).end(JSON.stringify(lista))
    })
})

korisnikRouter.get('/getAllAssistants', function(req,res) {
    res.contentType('application/json');
    console.log('tu')
    db.Korisnik.findAll({where:{idUloga:2}}).then( lista => {
        res.status(200).end(JSON.stringify(lista))
    })
})

korisnikRouter.get('/getAllProfessors', function(req,res) {
    res.contentType('application/json');
    console.log('tu')
    db.Korisnik.findAll({where:{idUloga:3}}).then( lista => {
        res.status(200).end(JSON.stringify(lista))
    })
})




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


korisnikRouter.post('/updateProfessor', async function(req,res) {
var podaci =  req.body;
res.contentType('application/json');

await db.Korisnik.findOne({where:{username: req.body.username, idUloga: 3}}).then( async function(prof) {
    if(!prof) {
        return res.status(400).send({message: 'Profesor se ne nalazi u bazi'});
    }
    else {
         //validacija       
        req.body.spol = 1;
        req.body.mjestoRodjenja = ' ';
        req.body.JMBG = '0603997175555';
         var provjera = await validacijaPodataka(req.body);
       
         if(provjera != 'Ok') return res.status(400).send({message : provjera});     
        else {       

        await db.Odsjek.findOne({where: {naziv: req.body.odsjek}}).then( function(odsjek) {
             var json = {
                 idOdsjek: odsjek.idOdsjek, 
                 ime: podaci.ime, 
                 prezime: podaci.prezime,               
                 email: podaci.email,              
                 kanton: podaci.kanton,
                 drzavljanstvo: podaci.drzavljanstvo,
                 telefon: podaci.telefon,             
                 adresa: podaci.adresa,              
                 linkedin: podaci.linkedin,
                 website: podaci.website,
                 titula: podaci.titula};
                return prof.update(json).then(()=> {
                    return res.status(200).send({message: 'Uspjesno azurirane informacije o profesoru'})
                 });
                
     }).catch(err => {
        console.log(err);
    })
         }
        }
})
});

//generisanje username-a i passworda za profesora
// link: http://si2019alpha.herokuapp.com/api/korisnik/GetLoginDataForProfessor?ime=Nemanja&prezime=Nemanjovic
korisnikRouter.get('/GetLoginDataForProfessor',function(req,res){
    res.contentType('application/json');  
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    console.log()
    if(!ime || ime == undefined || !prezime || prezime == undefined) return res.status(400).send({message: 'Unesite ime/prezime'});
         
  
    var userName = ime + '.'+ prezime;
    userName = userName.toLowerCase();
   // console.log(userName);

    db.Korisnik.findAll({where:{ime:ime,prezime:prezime, idUloga:3}}).then(data => {
        var brojDuplikata = 0;
        (data).forEach(element => {
            var tmp = parseInt(element.username.replace( /^\D+/g, ''));
            if(tmp > brojDuplikata) brojDuplikata = tmp;
        });

        //console.log(brojDuplikata);
        userName += ++brojDuplikata;
        var password = generator.generate({
        length: 8,
        numbers: true
        });
        return res.status(200).send(JSON.stringify({
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
// link http://si2019alpha.herokuapp.com/api/korisnik/AddNewProfessor
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
        return body.idOdsjek = odsjek.idOdsjek;        
    }).catch( err => {
        console.log(err);
    })    
  
    date = body.datumRodjenja.substring(0,10);
    body.datumRodjenja = date;

    //validacija        
    
    let duzine = await validacijaStringova(req.body);
   // console.log(duzine);
    let provjera = await validacijaPodataka(body);    
   // console.log(provjera);
    let dr = await validacijaDatumaRodjenja(body.datumRodjenja);    
  //  console.log(dr);
    let dj = await provjeriDatumJmbg(body.datumRodjenja,body.JMBG);    
   // console.log(dj);   

    if(duzine != 'Ok') return res.status(400).send({message: duzine});
    else if(provjera != 'Ok') return res.status(400).send({message: provjera});
    else if(!dr) return res.status(400).send({message: 'Neispravan datum rodjenja!'});
    else if(!dj) return res.status(400).send({message: 'JMBG i datum rodjenja se ne poklapaju'});
    else {
         //pomjereno radi testova 
        await db.Korisnik.findOne({where:{JMBG:body.JMBG}}).then(prof => {
            if(prof != null) {
              //  console.log('profa'+prof);
                return res.status(400).send({message: 'Postoji korisnik sa istim JMBG!'});
            }   
            else {
       

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = async function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            var data = JSON.parse(ajax.responseText);
         //   console.log(data);
            if(body.spol.toLowerCase() == 'musko' || body.spol.toLowerCase() == 'muško')
            body.spol = 1;            
            else if(body.spol.toLowerCase() == 'zensko' || body.spol.toLowerCase() == 'žensko')
            body.spol = 0;
         
            body.idUloga = 3;
            body.username = data.username;
            body.password = md5(data.password);
            await db.Korisnik.create(body).then( () => {              
                return res.status(200).end(JSON.stringify({
                    username: data.username,
                    password: data.password,
                }));     
            }).catch( err => {
                console.log(err);
            })           
      
          
        }
    }
    ajax.open('GET', 'http://si2019alpha.herokuapp.com/api/korisnik/GetLoginDataForProfessor?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
    }

}).catch( err => {
    console.log(err);
}) 
    }
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



korisnikRouter.get('/GetLoginData',async function(req,res) {
    var ime = req.query.ime;
    var prezime = req.query.prezime;
    res.contentType('application/json');  

    if(!ime || !prezime) {
        return res.status(400).end(JSON.stringify({message: "Unesite ime/prezime"}));
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
            var brojDuplikata = 0;
            (data).forEach(element => {
                var tmp = parseInt(element.username.replace( /^\D+/g, ''));
                if(tmp > brojDuplikata) brojDuplikata = tmp;
            });

            userName += ++brojDuplikata;
            var password = generator.generate({
            length: 8,
            numbers: true
            });
            
            db.Korisnik.max('indeks', {
                where: {
                    indeks: {
                        [Op.regexp]: '^[0-9]'
                    }
                }
            })
            .then(data => {
                var indeks = parseInt(data) + 1;
                return res.end(JSON.stringify({
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
    console.log('Ok');
    // Prilagodjavanje imenovanja
    if(!body.datumRodjenja && body.datum) body.datumRodjenja = body.datum;
    if(!body.JMBG && body.jmbg) body.JMBG = body.jmbg;
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
            body.idUloga = 1;
            body.username = data.username;
            body.password = md5(data.password);
            body.indeks = data.indeks;
            db.Korisnik.create(body);      
            return res.status(200).end(JSON.stringify({
                username: data.username,
                password: data.password,
                indeks: data.indeks
            }));        
        }
    }
    ajax.open('GET', 'http://si2019alpha.herokuapp.com/api/korisnik/GetLoginData?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
    
});

korisnikRouter.post('/AddNewAssistant', async function(req,res) {
    let body = req.body;
    
    // Prilagodjavanje imenovanja
    if(!body.datumRodjenja && body.datum) body.datumRodjenja = body.datum;
    if(!body.JMBG && body.jmbg) body.JMBG = body.jmbg;
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
            body.idUloga = 2;
            body.username = data.username;
            body.password = md5(data.password);
            body.indeks = data.indeks;
            db.Korisnik.create(body);      
            return res.status(200).end(JSON.stringify({
                username: data.username,
                password: data.password,
                indeks: data.indeks
            }));            
        }
    }
    ajax.open('GET', 'http://si2019alpha.herokuapp.com/api/korisnik/GetLoginData?ime=' + body.ime + '&prezime=' + body.prezime, true);
    ajax.setRequestHeader('Content-Type','application/json');
    ajax.send();  
    
    
});

global.JsonNiz = async function(korisnici,res) {
  
    var niz = [];
    for(var el in korisnici) {
       await db.Odsjek.findOne({where: {idOdsjek: korisnici[el].idOdsjek}}).then( odsjek => {
            var odjsekTmp = null;
            if(odsjek) odjsekTmp = odsjek.naziv;
            
            var json = {
                id: korisnici[el].id,
                odsjek: odjsekTmp,
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
// link: http://si2019alpha.herokuapp.com/api/korisnik/searchProfessor?ime=Amer
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

korisnikRouter.post('/updateAssistant', function(req,res) {
    res.contentType('application/json');
    let body = req.body;

    if(!body.id) return res.status(400).end(JSON.stringify({message: "Nije poslan id!"}));
    if(body.id.toString().length > 10) return res.status(400).end(JSON.stringify({message: "Id je predugacak!"}));
    if(!parseInt(body.id)) return res.status(400).end(JSON.stringify({message: "Nevalidan id!"}));

    if(!body.ime || !body.prezime || body.ime == '' || body.prezime == '') return res.status(400).end(JSON.stringify({message: "Nisu uneseni svi obavezni podaci!"}));
    if(body.ime.length > 50 || body.prezime.length > 50 || ((body.email && body.email.length > 50) || (body.telefon && body.telefon.length > 50) || (body.adresa && body.adresa.length > 50) || (body.telefon && body.telefon.length > 50)))
        return res.status(400).end(JSON.stringify({message: "Podaci su predugacki!"}));

    db.Korisnik.findOne({where:{id: body.id, idUloga: 2}})
    .then(asistent => {
        if(!asistent) return res.status(400).end(JSON.stringify({message: "Odabrani asistent ne postoji!"}));
        
        asistent.update({
            ime: body.ime,
            prezime: body.prezime,
            email: body.email,
            telefon: body.telefon,
            adresa: body.adresa
        })
        .then(data => {
            return res.status(200).end(JSON.stringify({message: "Asistent uspjesno azuriran!"}));
        })
        .catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske!"}));
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske!"}));
    });
    
});

// Unapređivanje studenta u asistenta
korisnikRouter.post('/promoteStudentToAssistant', function(req,res) {
    let body = req.body;
    if(!body.id) return res.status(400).send({message: 'Nije unesen id!'});
    if(!parseInt(body.id)) return res.status(400).send({message: 'Uneseni id nije validan!'});
    if(body.id.toString().length > 10) return res.status(400).send({message: 'Uneseni id je predugacak!'});

    db.Korisnik.findOne({where: {idUloga: 1, id: body.id}})
    .then(student => {
        if(!student) return res.status(400).send({message: 'Student sa unesenim Id-em ne postoji u sistemu!'});
        student.update({idUloga : 2})
        .then(data => {
            return res.status(200).send({message: 'Student je uspjesno unaprijedjen u asistenta!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'Doslo je do interne greske!'});
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'Doslo je do interne greske!'});
    });
})

// Unapređivanje asistenta u profesora
korisnikRouter.post('/promoteAssistantToProfessor', function(req,res) {
    let body = req.body;
    if(!body.id) return res.status(400).send({message: 'Nije unesen id!'});
    if(!parseInt(body.id)) return res.status(400).send({message: 'Uneseni id nije validan!'});
    if(body.id.toString().length > 10) return res.status(400).send({message: 'Uneseni id je predugacak!'});

    let assistant;
    var ajax = new XMLHttpRequest();

    db.Korisnik.findOne({where: {idUloga: 2, id: body.id}})
    .then(foundAssistant => {
        assistant = foundAssistant;
        if(!assistant) return res.status(400).send({message: 'Asistent sa unesenim Id-em ne postoji u sistemu!'});

        ajax.open('GET', 'http://si2019alpha.herokuapp.com/api/korisnik/GetLoginDataForProfessor?ime=' + assistant.ime + '&prezime=' + assistant.prezime, true);
        ajax.setRequestHeader('Content-Type','application/json');
        ajax.send();
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'Doslo je do interne greske!'});
    });

    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            var data = JSON.parse(ajax.responseText);
            console.log(data);
            assistant.update({idUloga : 3, username : data.username})
            .then(data => {
                return res.status(200).send({message: 'Asistent je uspjesno unaprijedjen u profesora!'});
                })
            .catch(err => {
                console.log(err);
                return res.status(500).send({message: 'Doslo je do interne greske!'});
            })
        }
        else if (ajax.readyState == 4) {
            return res.status(500).send({message: 'Doslo je do interne greske!'});
        }
    }
})

//Pretraga asistenata
korisnikRouter.get('/searchAssistant', function(req,res){
    res.contentType('application/json');
    if(req.query.ime != null && req.query.ime != '' && req.query.prezime != null && req.query.prezime != '') { // ime i prezime
        db.Korisnik.findAll({where: {idUloga: 2, ime: req.query.ime, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.ime != null && req.query.ime != '') { //ime
       db.Korisnik.findAll({where: {idUloga: 2, ime: req.query.ime}}).then( korisnici => {
           JsonNiz(korisnici,res);
       })
    }
    else if(req.query.prezime != null && req.query.prezime != '') { //prezime
        db.Korisnik.findAll({where: {idUloga: 2, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.username != null && req.query.username != '') { //username
        db.Korisnik.findAll({where: {idUloga: 2, username: req.query.username}}).then( korisnici => {
            JsonNiz(korisnici,res);      
           
        })
    }
})

// Pretraga osoba
korisnikRouter.get('/searchUser', function(req,res){
    res.contentType('application/json');
    if(req.query.ime != null && req.query.ime != '' && req.query.prezime != null && req.query.prezime != '') { // ime i prezime
        db.Korisnik.findAll({where: {ime: req.query.ime, prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.ime != null && req.query.ime != '') { //ime
       db.Korisnik.findAll({where: {ime: req.query.ime}}).then( korisnici => {
           JsonNiz(korisnici,res);
       })
    }
    else if(req.query.prezime != null && req.query.prezime != '') { //prezime
        db.Korisnik.findAll({where: {prezime: req.query.prezime}}).then( korisnici => {
            JsonNiz(korisnici,res);            
        })
    }
    else if(req.query.username != null && req.query.username != '') { //username
        db.Korisnik.findAll({where: {username: req.query.username}}).then( korisnici => {
            JsonNiz(korisnici,res);      
           
        })
    }
})

korisnikRouter.post('/enrollStudentToSemester', function(req,res) {
    res.contentType('application/json');
    let body = req.body;
    let god;
    let idOdsjek;
    let idStudent;
    let idPredmeta = [];
    let akademskaGodina;

	if(!parseInt(body.ciklus) || !parseInt(body.semestar) ||  !body.username || !body.odsjek){
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
	if(body.ciklus < 1 || body.ciklus > 3 || body.semestar < 1) {
		return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
	}
    
    if((body.ciklus == 1 && body.semestar > 6) || ((body.ciklus == 2 || body.ciklus == 3) && body.semestar > 4))  return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));

    let godConverted = Math.ceil(body.semestar / 2);
    let semestarConverted = ((body.semestar + 1) % 2) + 1 ;
    god = body.ciklus * godConverted;
        
    db.Odsjek.findOne({where: {naziv: body.odsjek}})
    .then(odsjek => {
        if(!odsjek) return res.status(400).end(JSON.stringify({message: "Odabrani odsjek ne postoji"}));
        idOdsjek = odsjek.idOdsjek;
        let promiseList = [];

        promiseList.push(db.Korisnik.findOne({where: {idUloga: 1, username: body.username}})
        .then(student => {
            if(!student) return res.status(400).end(JSON.stringify({message: "Ne postoji student sa unesenim username-om"}));
            idStudent = student.id;  
        })
        .catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske"}));
        }));
    

        promiseList.push(db.odsjek_predmet.findAll({where: {idOdsjek: idOdsjek, semestar: semestarConverted, godina: god}})
        .then(odsjekPredmet => {
            if(!odsjekPredmet) return res.status(400).end(JSON.stringify({message: "Ne postoje predmeti za odabrani odsjek i semestar"}));
            odsjekPredmet.forEach(element => {
                idPredmeta.push(element.idPredmet);
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske"}));
        }));

        promiseList.push(db.AkademskaGodina.findOne({where: {aktuelna: 1}})
        .then(god => {
            if(!god) return res.status(400).end(JSON.stringify({message: "Ne postoji aktuelna akademska godina"}));
            akademskaGodina = god.id;
        })
        .catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske"}));
        }));
        
        Promise.all(promiseList).then(x => {
            let promiseList2 = [];
            idPredmeta.forEach(element => {
                db.predmet_student.findOne({where:{idStudent: idStudent, idPredmet: element}})
                .then(obj => {
                    console.log('OK');
                    if(!obj) promiseList2.push(db.predmet_student.create({
                        idStudent: idStudent,
                        idPredmet: element,
                        idAkademskaGodina: akademskaGodina
                    })
                    .then(x => {
                        console.log('Upisan na predmet');
                    })
                    .catch(err => {
                        console.log(err);
                        return err;
                    })) 
                })
            });

            Promise.all(promiseList2).then(y => {
                return res.status(200).end(JSON.stringify({message: "Student uspjesno upisan u semestar"}));
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske!"}));
        })

    })
    .catch(err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: "Doslo je do interne greske"}));
    })




})

module.exports = korisnikRouter;
