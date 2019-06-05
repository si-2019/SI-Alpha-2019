const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('DELETE /deleteProfessor', () => {


    it('Treba vratiti status 400 sa porukom o gresci', function(done){
        chai.request(app)
        .delete('/api/korisnik/deleteProfessor')
        .query({id:1})
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Ne postoji taj profesor');
            done();
        })
    })
    //dodat test za dodavanje profesora sa stalnim idem koji ce se u iducem testu obrisat
    it(' Hardkodirani test koji dodaje profesora, koji ce biti obrisan u iducem testu', function(done) {
        chai.request(app)
        .get('/api/unos/upisiProfesora')
        .end((err,res) => {
            res.should.have.status(200);
            done();
        })
    })
    
    it('Treba vratit status 200 i poruku da je obrisan profesor iz baze', function(done) {
        chai.request(app)
        .delete('/api/korisnik/deleteProfessor')
        .query({id:3333})
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Uspjesno obrisan profesor');
            done();
        })
    })

    it('Treba vratit status 400 i poruku da fali id', function(done) {
        chai.request(app)
        .delete('/api/korisnik/deleteProfessor')
        .query({id:null})
        .end((err,res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('ID nije poslan');
            done();
        })
    })
})