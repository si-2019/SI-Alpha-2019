const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();
describe('/GET getAllStudents,getAllAssistants,getAllProfessors', () => {
	it('Treba da vrati sve studente i status 200', function(done) {
		chai.request(app)
			.get('/api/korisnik/getAllStudents')
			.end((err, res) => {
				res.should.have.status(200)
				done();
			})
	})

	it('Treba da vrati sve asistente i status 200', function(done) {
		chai.request(app)
			.get('/api/korisnik/getAllAssistants')
			.end((err, res) => {
				res.should.have.status(200)
				done();
			})
	})

	it('Treba da vrati sve profesore i status 200', function(done) {
		chai.request(app)
			.get('/api/korisnik/getAllProfessors')
			.end((err, res) => {
				res.should.have.status(200)
				done();
			})
	})
})