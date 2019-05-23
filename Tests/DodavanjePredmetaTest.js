const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST AddNewPredmet', () => {
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
				done();
			})
	})
	
	it('Treba se pojaviti greska prilikom pokusaja unosa već postojećeg predmeta', function(done) {
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
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
	
	it('Treba se pojaviti greska prilikom pokusaja unosa predmeta sa praznim poljima', function(done) {
		chai.request(app)
			.post('/api/predmet/AddNewPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: '',
				ects: 5,
				brojPredavanja: 20,
				brojVjezbi: 10,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
})