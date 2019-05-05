const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/GET getLoginData', () => {
    it('Treba vratiti status 200, imati odgovarajuce propertye i username odgovara specificiranom sablonu', function(done) {
        chai.request(app)
            .get('/api/korisnik/GetLoginData')
            .query({ime: "test", prezime:"testic"})
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('username')
                res.body.should.have.property('password')
                res.body.should.have.property('indeks')
                res.body.username.should.include("ttestic")
                done();
            })
    })

    it('Nedostaje parametar prezime, treba vratiti status 400 sa porukom o gresci', function(done) {
        chai.request(app)
            .get('/api/korisnik/GetLoginData')
            .query({ime: "test"})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done();
            })
    })

    it('Nedostaje parametar ime, treba vratiti status 400 sa porukom o gresci', function(done) {
        chai.request(app)
            .get('/api/korisnik/GetLoginData')
            .query({prezime: "test"})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                done();
            })
    })
})