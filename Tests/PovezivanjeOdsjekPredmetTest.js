const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();
var today = new Date();
var naziv = 'Test' + today.getHours() + today.getMinutes() + today.getSeconds();
var OdsjekBody;
var PredmetBody;

describe('/POST SpojiOdsjekPredmet', () => {
	it('Treba se unijeti odsjek u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: naziv
			})
			.end((err, res) => {
				res.should.have.status(200)
				OdsjekBody = res.body;
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include(naziv)
				done();
			})
	})
	
	it('Treba se unijeti predmet u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/predmet/AddNewPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: naziv,
				ects: 5,
				brojPredavanja: 20,
				brojVjezbi: 10,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(200)
				PredmetBody = res.body;
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
                res.body.should.have.property('ects')
                res.body.should.have.property('opis')
				res.body.naziv.should.include(naziv)
				done();
			})
	})
	
	it('Treba se spojiti odsjek i predemet', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: OdsjekBody.idOdsjek,
				idPredmet: PredmetBody.id,
				semestar: 1,
				godina: 2,
				ciklus: 2,
				obavezan: 1
			})
			.end((err, res) => {
				if(res.body==0 || res.body==1){
					done();
				}
				res.should.have.status(200)
                res.body.should.be.a('Array')
				res.body[0].should.have.property('idOdsjek')
				res.body[0].should.have.property('idPredmet')
				res.body[0].should.have.property('semestar')
				res.body[0].should.have.property('godina')
				res.body[0].should.have.property('obavezan')
				done();
			})
	})
	
	it('Treba se javiti greska jer godina nije validan', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: OdsjekBody.idOdsjek,
				idPredmet: PredmetBody.id,
				semestar: 1,
				godina: -2,
				ciklus: 2,
				obavezan: 1
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				res.body.message.should.include("Nisu sve vrijednosti validne")
				done();
			})
	})
	
	it('Treba se javiti greska jer id-evi predmeta i odsjeka nisu validni', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: "a",
				idPredmet: "s",
				semestar: 1,
				godina: 2,
				ciklus: 2,
				obavezan: 1
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				res.body.message.should.include("Nije se moglo staviti u medutabeli")
				done();
			})
	})
	
	it('Briše se veza', function(done) {
		chai.request(app)
			.delete('/api/povezivanje/BrisiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: OdsjekBody.idOdsjek,
				idPredmet: PredmetBody.id,
			})
			.end((err, res) => {
				if(res.body==0 || res.body==1){
					res.should.have.status(200)
					done();
				}
				else{
					res.should.have.status(400)
				}
			})
	})
	
	it('Brise se odsjek iz baze', function(done) {
		chai.request(app)
			.delete('/api/odsjek/DeleteOdsjek?naziv=' + encodeURIComponent(naziv))
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
	
	it('Brise se predmet iz baze', function(done) {
		chai.request(app)
			.delete('/api/predmet/deleteSubject?naziv=' + encodeURIComponent(naziv))
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
})