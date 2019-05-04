//const request = require('supertest');
var chai = require('chai'), chaiHttp = require('chai-http');
var mocha = require('mocha');
//var describe = mocha.describe;
chai.use(chaiHttp);
var app = require('../../index');
var http = require('http');

chai.use(chaiHttp);
//var should = chai.should();
const except = require('chai').expect;
const dotenv = require('dotenv');
dotenv.config();


describe('Testiranje get  /api/korisnik/GetLoginDataForProfessor', function() {
    it('Greska jer prezime nije uneseno', function(done) {
        chai.request(app)
        .get('/api/korisnik/GetLoginDataForProfessor')
        .query({ ime: 'Zlata', prezime: ''})
        .end(function(err,res){
            res.should.have.status(400);
            res.should.be.json;
          /*  except(res.body).to.equal(JSON.stringify({
                message: 'Unesite ime/prezime'
            }));*/
            done();
        });
    });
});