const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('DELETE /deleteAssistant', () => {


    it('Treba vratiti status 404 sa porukom o gresci, jer asistenta sa tim id-em nema', function(done){
        chai.request(app)
        .delete('/api/korisnik/deleteAssistant')
        .query({id:1})
        .end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Ne postoji asistent sa tim id-em');
            done();
        })
    })
    //dodat test za dodavanje asistenta sa stalnim idem koji ce se u iducem testu obrisat
    it(' Hardkodirani test koji dodaje asistenta, koji ce biti obrisan u iducem testu', function(done) {
        chai.request(app)
        .get('/api/unos/unesiAsistenta')
        .end((err,res) => {
            res.should.have.status(200);
            done();
        })
    })

    it('Vratiti 200 i izbrisat asistenta', function(done) {
        chai.request(app)
        .delete('/api/korisnik/deleteAssistant')
        .query({id:241})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Obrisan iz baze');
            done();
        })

    })

})