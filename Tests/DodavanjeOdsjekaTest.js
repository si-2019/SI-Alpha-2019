const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST AddNewOdsjek', () => {
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
				done();
			})
	})
	
	it('Treba se pojaviti greska prilikom pokusaja unosa već postojećeg odsjek', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Unit test odsjek'
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
})