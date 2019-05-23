const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST SpojiOdsjekPredmet', () => {
	it('Treba se spojiti odsjek i predemet', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: 33,
				idPredmet: 4,
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
	
	it('Treba se javiti greska jer godina nije validan', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: 33,
				idPredmet: 4,
				semestar: 1,
				godina: -2,
				ciklus: 2,
				obavezan: 1
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				res.body.message.should.include("Nisu sve vrijednosti validne")
				done();
			})
	})
	
	it('Treba se javiti greska jer id-evi predmeta i odsjeka nisu validni', function(done) {
		chai.request(app)
			.post('/api/povezivanje/SpojiOdsjekPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				idOdsjek: "a",
				idPredmet: "s",
				semestar: 1,
				godina: 2,
				ciklus: 2,
				obavezan: 1
			})
			.end((err, res) => {
				res.should.have.status(400)
                res.body.should.be.a('object')
				res.body.should.have.property('message')
				res.body.message.should.include("Nije se moglo staviti u medutabeli")
				done();
			})
	})
})