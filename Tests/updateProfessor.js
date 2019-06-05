const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST updateProfessor', () => {
    let profesor = {
        id: 3333,
        odsjek: 'RI',
        idUloga: 3,    
        ime:'Zulfo',
        prezime: 'Zulfic',
        datumRodjenja: '1911-01-01',
        JMBG: '0101911175070',
        email: 'malalala.com',
        mjestoRodjenja: 'Travnik',
        kanton: 'SBK',
        drzavljanstvo: 'BiH',
        telefon: '062/033-033',
        spol: 1,
        imePrezimeMajke: 'Fatima Aktic',
        imePrezimeOca: 'Meho Pasic',
        adresa: 'Gornja Maoca',
        username: 'zulfo.zulfic1',
        linkedin: 'prof.com',
        website: 'prof_muha.com',
        titula: 'red'
    }
    let ruta = '/api/korisnik/updateProfessor';

    it(' Hardkodirani test koji dodaje profesora, koji ce biti azuriran u iducem testu', function(done) {
        chai.request(app)
        .get('/api/unos/upisiProfesora')
        .end((err,res) => {
            res.should.have.status(200);
            done();
        })
    })

    it('Upjesno azuriranje, treba vratiti status 200', function(done) { 

        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => { 
                res.should.have.status(200)
                res.body.should.have.property("message")
                res.body.message.should.equal('Uspjesno azurirane informacije o profesoru')
                done();
            })
    })

    it('Nedostaje parametar prezime, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.prezime = '';

        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Niste unijeli prezime!')
                profesor.prezime = 'Zulfic';
                done();
            })
    })


    it('Nedostaje parametar ime, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.ime = '';

        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Niste unijeli ime!')
                profesor.ime = 'Zulfo';
                done();
            })
    })

    it('Nepostojeci profesor, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.username ='zulfo.zulfic132131'
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Profesor se ne nalazi u bazi')
                profesor.username='zulfo.zulfic1'
                done();
            })
    })

    /*

    it('Podaci izvan opsega, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.ime = 'mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11';
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Podaci su predugacki!')
                profesor.ime = 'Mario';
                done();
            })
    }) */

    it('Treba vratit status 200 i obirsati unesenog profesora', function(done) {
        chai.request(app)
        .delete('/api/unos/izbrisatProfesora')
        .query({username:'zulfo.zulfic1'})
        .end((err,res) => {
            res.should.have.status(200);
            done();
        })
    })
})