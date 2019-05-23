const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST updateProfessor', () => {
    let profesor = {
        id: 183,
        odsjek: 'TK',
        ime: 'Amer',
        prezime: 'Pasic',
        datumRodjenja: '1993-04-30',
        JMBG: '3004993175070',
        email: 'malalala.com',
        mjestoRodjenja: 'Travnik',
        kanton: 'SBK',
        drzavljanstvo: 'BiH',
        telefon: '062/033-033',
        spol: 'musko',
        imePrezimeMajke: 'Fatima Aktic',
        imePrezimeOca: 'Meho Pasic',
        adresa: 'Gornja Maoca',
        username: 'amer.pasic2',
        linkedin: 'prof.com',
        website: 'prof_muha.com',
        titula: 'red'      
    };
    let ruta = '/api/korisnik/updateProfessor';

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
                profesor.prezime = 'Pasic';
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
                profesor.ime = 'Amer';
                done();
            })
    })

    it('Nepostojeci profesor, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.username ='a.k'
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Profesor se ne nalazi u bazi')
                profesor.username='amer.pasic2'
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
})