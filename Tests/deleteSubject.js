const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('DELETE /deleteSubject', () => {
    it('Treba vratiti status 400 sa porukom o gresci', function(done){
        chai.request(app)
        .delete('/api/predmet/deleteSubject')
        .query({naziv: "IM1"})
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Ne postoji predmet sa tim nazivom');
            done();
        })
    })
    //dodat test za dodavanje predmeta koji ce se u iducem testu obrisat
    it('Dodan hardkodirani predmet, da bi se izbrisao u iducem testu', function(done) {
        chai.request(app)
        .get('/api/unos/unesiPredmet')
        .end((err,res) => {
            res.should.have.status(200);
            done();
        }) 
    })
    
    it('Treba vratit status 200 i poruku da je obrisan predmet iz baze', function(done) {
        chai.request(app)
        .delete('/api/predmet/deleteSubject')
        .query({naziv: "RPP"})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Uspjesno obrisan predmet');
            done();
        })
    })
})