const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect
var body;

chai.use(chaiHttp);
chai.should();
var today = new Date();
var naziv = 'Test predmet' + today.getHours() + today.getMinutes() + today.getSeconds();

describe('/GET GetPredmet i POST PromijeniPredmet', () => {
	it('Treba se unijeti predmet u bazi podataka za ostala testiranja', function(done) {
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
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
                res.body.should.have.property('ects')
                res.body.should.have.property('opis')
				res.body.naziv.should.include(naziv)
				body=res.body;
				done();
			})
	})
	
	it('Treba se moci dohvatiti predmet preko naziva', function(done) {
		chai.request(app)
			.get('/api/predmet/GetPredmet?naziv=' + encodeURIComponent(naziv))
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include(naziv)
				done();
			})
	})
	
	it('Treba se moci promijeniti naziv predmeta', function(done) {
		chai.request(app)
			.post('/api/predmet/PromijeniPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				Id: body.id,
				naziv: 'Test',
				ects: 50,
				brojPredavanja: 10,
				brojVjezbi: 20,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Test")
				done();
			})
	})
	
	it('Treba se javiti greska u slučaju da nema predmeta u bazi sa unesenim id-jem', function(done) {
		chai.request(app)
			.post('/api/predmet/PromijeniPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				id: 0,
				naziv: 'Test',
				ects: 50,
				brojPredavanja: 10,
				brojVjezbi: 20,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(400)
				res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
	
	it('Treba se javiti greska u slučaju da uneseni podaci nisu validni', function(done) {
		chai.request(app)
			.post('/api/predmet/PromijeniPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				id: body.id,
				naziv: '',
				ects: 50,
				brojPredavanja: 10,
				brojVjezbi: 20,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(400)
				res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
	
	it('Brise se predmet iz baze', function(done) {
		chai.request(app)
			.delete('/api/predmet/deleteSubject?naziv=Test')
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
})