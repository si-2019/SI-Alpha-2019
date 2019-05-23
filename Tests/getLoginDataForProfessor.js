const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();
describe('/GET GetLoginDataForProfessor', () => {
    let putanja = '/api/korisnik/GetLoginDataForProfessor';

    it('Treba vratiti status 200, imati odgovarajuce propertye i username za profesora', function(done) {
        chai.request(app)
            .get(putanja)
            .query({ime: "Zlata", prezime:"Karic"})
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('username')
                res.body.should.have.property('password')
                res.body.username.should.include("zlata.karic")
                done();
            })
    })

    it('Nedostaje parametar prezime, treba vratiti status 400 sa porukom o gresci', function(done) {
        chai.request(app)
            .get(putanja)
            .query({ime: "Zlata"})
            .end((err, res) => {
                res.should.have.status(400)              
                expect(res.body.message).to.equal('Unesite ime/prezime')
                done();
            })
    })

    it('Nedostaje parametar ime, treba vratiti status 400 sa porukom o gresci', function(done) {
        chai.request(app)
            .get(putanja)
            .query({prezime: "Karic"})
            .end((err, res) => {
                res.should.have.status(400)
                expect(res.body.message).to.equal('Unesite ime/prezime')
                done();
            })
    })
})