const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect
var idOdsjek;
var idPredmet;

chai.use(chaiHttp);
chai.should();

describe('/DELETE BrisiOdsjekPredmet', () => {
	it('Treba se unijeti odsjek u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Unit test odsjek'
			})
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Unit test odsjek")
				idOdsjek=res.body.idOdsjek;
				console.log("odsjek" + idOdsjek);
				done();
			})
	})
	
	it('Treba se unijeti predmet u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/predmet/AddNewPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Unit test predmet',
				ects: 5,
				brojPredavanja: 20,
				brojVjezbi: 10,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
                res.body.should.have.property('ects')
                res.body.should.have.property('opis')
				res.body.naziv.should.include("Unit test predmet")
				idPredmet=res.body.id;
				console.log("predmet" + idPredmet);
				done();
			})
	})
	
	it('Treba se spojiti odsjek i predemet', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: idOdsjek,
				idPredmet: idPredmet,
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
	
	it('Briše se veza', function(done) {
		chai.request(app)
			.delete('/api/povezivanje/BrisiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: idOdsjek,
				idPredmet: idPredmet
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
})