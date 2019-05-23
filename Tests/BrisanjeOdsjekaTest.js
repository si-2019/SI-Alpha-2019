const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

var body;
chai.use(chaiHttp);
chai.should();

describe('/DELETE DeleteOdsjek', () => {
	it('Treba se unijeti odsjek u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/odsjek/AddNewOdsjek')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: 'Unit test odsjek'
			})
			.end((err, res) => {
				res.should.have.status(200)
				body=res.body;
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
				res.body.naziv.should.include("Unit test odsjek")
				done();
			})
	})
	
	it('Treba se obrisati uneseni odsjek', function(done) {
		chai.request(app)
			.delete('/api/odsjek/DeleteOdsjek?id=' + body.idOdsjek)
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				done();
			})
	})
})