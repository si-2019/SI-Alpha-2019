const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();
describe('/POST enrollStudentToSemester', () => {
    let putanja = '/api/korisnik/enrollStudentToSemester';

    it('Nevalidan ciklus, treba vratiti status 400 i poruku o gresci', function(done) {
        chai.request(app)
            .post(putanja)
            .send({
                username: "esehovic2",
                ciklus: 4,
                semestar: 1,
                odsjek: 'RI'
            })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nisu sve vrijednosti validne')
                done();
            })
    })

    it('Nevalidan semestar, treba vratiti status 400 i poruku o gresci', function(done) {
        chai.request(app)
            .post(putanja)
            .send({
                username: "esehovic2",
                ciklus: 2,
                semestar: 5,
                odsjek: 'RI'
            })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nisu sve vrijednosti validne')
                done();
            })
    })

    it('Nevalidan ciklus - nije broj, treba vratiti status 400 i poruku o gresci', function(done) {
        chai.request(app)
            .post(putanja)
            .send({
                username: "esehovic2",
                ciklus: 'test',
                semestar: 1,
                odsjek: 'RI'
            })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nisu sve vrijednosti validne')
                done();
            })
    })

    it('Nevalidan semestar - nije broj, treba vratiti status 400 i poruku o gresci', function(done) {
        chai.request(app)
            .post(putanja)
            .send({
                username: "esehovic2",
                ciklus: 1,
                semestar: 'test',
                odsjek: 'RI'
            })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nisu sve vrijednosti validne')
                done();
            })
    })

    it('Nedostaje parametar odsjek, treba vratiti status 400 i poruku o gresci', function(done) {
        chai.request(app)
            .post(putanja)
            .send({
                username: "esehovic2",
                ciklus: 1,
                semestar: 1
            })
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nisu sve vrijednosti validne')
                done();
            })
    })
})