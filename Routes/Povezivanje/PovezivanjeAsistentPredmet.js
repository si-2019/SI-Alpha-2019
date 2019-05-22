const express = require('express');
const asistentPredmetRouter = express.Router();

const db = require('../../models/db.js');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
db.sequelize.sync();

const Op = db.Sequelize.Op;


asistentPredmetRouter.post('/linkAssistantSubject', function(req,res) {
    res.contentType('application/json');
    let body = req.body;
        if(!body.idAsistent || (!body.idPredmet && !body.id)) {
        return res.status(400).end(JSON.stringify({message: "Nisu sve vrijednosti validne"}));
    }
    if(!body.id) body.id = body.idPredmet;

    body.id = body.id.toString();
    body.idAsistent = body.idAsistent.toString();

    let idParse = parseInt(body.id);
    let idAsistentParse = parseInt(body.idAsistent);
    if(!idParse || !idAsistentParse) {
        return res.status(400).end(JSON.stringify({message: "Id nisu validni!"}));
    }
    else if(body.id.length > 10 || body.idAsistent.length > 10){
        return res.status(400).end(JSON.stringify({message: "Id su predugacki!"}));
    }
    

    let promiseList = [];
    let odsjek;
    let asistent;

    promiseList.push(db.Predmet.findByPk(body.id)
    .then(data => {
        if(!data) return res.status(400).end(JSON.stringify({message: "Odsjek nije pronadjen!"}));
        odsjek = data;
    })
    .catch(err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: "Greska u pristupu bazi"}));
    }));

    promiseList.push(db.Korisnik.findOne({where: {idUloga: 2, id: body.idAsistent}})
    .then(data => {
        if(!data) return res.status(400).end(JSON.stringify({message: "Asistent nije pronadjen!"}));
        asistent = data;
    })
    .catch(err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: "Greska u pristupu bazi"}));
    }));
    
    Promise.all(promiseList).then(x => {
        odsjek.update({
            idAsistent : body.idAsistent
        });
        return res.status(200).end(JSON.stringify({message: "Uspjesno povezan asistent sa predmetom"}));
    })
    .catch(err => {
        console.log(err);
        return res.status(500).end(JSON.stringify({message: "Interna greska!"}));
    });
});

module.exports = asistentPredmetRouter;