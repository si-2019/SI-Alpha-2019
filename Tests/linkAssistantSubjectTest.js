const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST linkAssistantSubject', () => {
    let zahtjev = {
        id : 4,
        idAsistent : 36
    }

    it('Nije poslan id predmeta, treba biti status 400 uz odgovarajucu poruku', function(done) {
        zahtjev.id = null;
        chai.request(app)
            .post('/api/povezivanje/linkAssistantSubject')
            .send(zahtjev)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("Nisu sve vrijednosti validne")
                zahtjev.id = 4;
                done();
            })
    });

    it('Nije poslan id asistenta, treba biti status 400 uz odgovarajucu poruku', function(done) {
        zahtjev.idAsistent = null;
        chai.request(app)
            .post('/api/povezivanje/linkAssistantSubject')
            .send(zahtjev)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("Nisu sve vrijednosti validne")
                zahtjev.idAsistent = 36;
                done();
            })
    });

    it('Predugacak id, treba biti status 400 uz odgovarajucu poruku', function(done) {
        zahtjev.id = 12345678912345678;
        chai.request(app)
            .post('/api/povezivanje/linkAssistantSubject')
            .send(zahtjev)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("Id su predugacki!")
                zahtjev.id = 4;
                done();
            })
    });

    it('Poslan id nepostojeceg asistenta, treba biti status 400 uz odgovarajucu poruku', function(done) {
        zahtjev.idAsistent = 36;
        chai.request(app)
            .post('/api/povezivanje/linkAssistantSubject')
            .send(zahtjev)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("Asistent nije pronadjen!")
                zahtjev.idAsistent = 1;
                done();
            })
    });

    it('Poslan id nepostojeceg predmeta, treba biti status 400 uz odgovarajucu poruku', function(done) {
        zahtjev.idAsistent = 41;
        zahtjev.id = 1;
        chai.request(app)
            .post('/api/povezivanje/linkAssistantSubject')
            .send(zahtjev)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal("Odsjek nije pronadjen!")
                zahtjev.id = 1;
                done();
            })
    });
/*
/*
/*
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
    */
})