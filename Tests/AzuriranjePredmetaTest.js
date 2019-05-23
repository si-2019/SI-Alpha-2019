const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect
var body;

chai.use(chaiHttp);
chai.should();

describe('/GET GetPredmet i POST PromijeniPredmet', () => {
	it('Treba se unijeti predmet u bazi podataka za ostala testiranja', function(done) {
		chai.request(app)
			.post('/api/predmet/AddNewPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Test predmet',
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
				res.body.naziv.should.include("Test predmet")
				body=res.body;
				done();
			})
	})
	
	it('Treba se moci dohvatiti predmet preko id-a', function(done) {
		chai.request(app)
			.get('/api/predmet/GetPredmet?id=' + body.id.toString())
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Test predmet")
				done();
			})
	})
	
	it('Treba se moci promijeniti naziv predmeta', function(done) {
		chai.request(app)
			.post('/api/predmet/PromijeniPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				id: body.id,
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
})