const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect
var body;

chai.use(chaiHttp);
chai.should();

describe('/GET GetOdsjek i POST PromijeniOdsjek', () => {
	it('Treba se unijeti odsjek u bazi podataka za ostala testiranja', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Azuriranje odsjek'
			})
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Azuriranje odsjek")
				body=res.body;
				done();
			})
	})
	
	it('Treba se moci dohvatiti odsjek preko id-a', function(done) {
		chai.request(app)
			.get('/api/odsjek/GetOdsjek?id=' + body.idOdsjek.toString())
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Azuriranje odsjek")
				done();
			})
	})
	
	it('Treba se moci promijeniti naziv odsjeka', function(done) {
		chai.request(app)
			.post('/api/odsjek/PromijeniOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: body.idOdsjek,
				naziv: 'Post Azuriranja'
			})
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Post Azuriranja")
				done();
			})
	})
	
	it('Treba se javiti greska u slučaju da nema odsjeka u bazi sa unesenim id-jem', function(done) {
		chai.request(app)
			.post('/api/odsjek/PromijeniOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: 0,
				naziv: 'Post Azuriranja'
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
			.post('/api/odsjek/PromijeniOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: 1,
				naziv: ''
			})
			.end((err, res) => {
				res.should.have.status(400)
				res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
})