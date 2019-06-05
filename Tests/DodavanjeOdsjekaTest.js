const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();
var today = new Date();
var naziv = 'Unit test odsjek' + today.getHours() + today.getMinutes() + today.getSeconds();

describe('/POST AddNewOdsjek', () => {
	it('Treba se unijeti odsjek u bazi podataka', function(done) {
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
				res.body.naziv.should.include(naziv)
				done();
			})
	})
	
	it('Treba se pojaviti greska prilikom pokusaja unosa već postojećeg odsjek', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: naziv
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
	
	it('Treba se pojaviti greska prilikom pokusaja unosa odsjeka sa praznim poljima', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
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
			.delete('/api/odsjek/DeleteOdsjek?naziv=' + encodeURIComponent(naziv))
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
})