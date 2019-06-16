const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();
var today = new Date();
var naziv = 'Azuriranje odsjek' + today.getHours() + today.getMinutes() + today.getSeconds();
var body;

describe('/GET GetOdsjek i POST PromijeniOdsjek', () => {
	it('Treba se unijeti odsjek u bazi podataka za ostala testiranja', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: naziv
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
	
	it('Treba se moci dohvatiti odsjek preko naziva', function(done) {
		chai.request(app)
			.get('/api/odsjek/GetOdsjek?naziv=' + encodeURIComponent(naziv))
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
	
	it('Treba se javiti greska u slučaju da nema odsjeka u bazi sa unesenim nazivom', function(done) {
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
	
	it('Brise se odsjek iz baze', function(done) {
		chai.request(app)
			.delete('/api/odsjek/DeleteOdsjek?naziv=' + encodeURIComponent('Post Azuriranja'))
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
})