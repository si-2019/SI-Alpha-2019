
const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('POST /linkProfessorSubject', () => {
    let idevi = {
        idProfesor: '36',
        idPredmet: '36'
    }

    it('ID profesora ima vise cifara', function(done) {
        let prof = idevi.idProfesor;
        idevi.idProfesor = '6823790876235456172889320';
        chai.request(app)
        .post('/api/povezivanje/linkProfessorSubject')
        .send(idevi)
        .end((err, res) => {
            res.should.have.status(400)
            idevi.idProfesor = prof;
            done();
        })

    })

    it('ID za predmet predug', function(done) {
        let predmet = idevi.idPredmet;
        idevi.idPredmet = '90876543456789098765434567890';
        chai.request(app)
        .post('/api/povezivanje/linkProfessorSubject')
        .send(idevi)
        .end((err, res) => {
            res.should.have.status(400)
            idevi.idPredmet = predmet;
            done();
        })
    })


    it('Ne postoji profesor', function(done) {
        let prof = idevi.idProfesor;
        idevi.idProfesor = '0';
        chai.request(app)
        .post('/api/povezivanje/linkProfessorSubject')
        .send(idevi)
        .end((err, res) => {
            res.should.have.status(400)
            idevi.idProfesor = prof;
            done();
        })
    })

    it('Ne postoji predmet', function(done) {
        let predmet = idevi.idPredmet;
        idevi.idPredmet = '0';
        chai.request(app)
        .post('/api/povezivanje/linkProfessorSubject')
        .send(idevi)
        .end((err, res) => {
            res.should.have.status(400)
            idevi.idPredmet = predmet;
            done();
        })
    })
})