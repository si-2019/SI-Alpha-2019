const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

var tempId = 0;
describe('DELETE /deleteStudent', () => {


    it('Treba vratiti status 400 sa porukom o gresci', function(done){
        chai.request(app)
        .delete('/api/korisnik/deleteStudent')
        .query({id:1})
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Ne postoji taj student');
            done();
        })
    })

    it(' Hardkodirani test koji dodaje studenta, koji ce biti obrisan u iducem testu', function(done) {
        chai.request(app)
        .post('/api/unos/unesiStudenta')
        .end((err,res) => {
            res.should.have.status(200);
            tempId = res.body.id;
            done();
        })
    })
    
    it('Treba vratit status 200 i poruku da je obrisan student iz baze', function(done) {
        chai.request(app)
        .delete('/api/korisnik/deleteStudent')
        .query({id:tempId})
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Uspjesno obrisan student');
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