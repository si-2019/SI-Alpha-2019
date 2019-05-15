const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST AddNewAssistant', () => {
    let student = {
        ime: 'Testimea',
        prezime: 'Testprezimea',
        datum: '1992-05-05',
        jmbg: '0505992512426',
        email: 'test@gmail.com',
        mjesto: 'Sarajevo',
        kanton: 'Sarajevski',
        drzavljanstvo: 'BiH',
        telefon: '061123124',
        spol: 'Musko',
        roditelj: 'Testov Roditelja',
        adresa: 'Testna 123'
    }

    it('Basic case - uspjesno dodavanje, treba vratiti status 200', function(done) {        
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
    })

    it('Nedostaje parametar prezime, treba vratiti status 400 i tekst o gresci', function(done) {
        let prezimeBackup = student.prezime;
        student.prezime = '';
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('Greska: Niste unijeli prezime!')
                student.prezime = prezimeBackup;
                done();
            })
    })

    it('Nedostaje parametar ime, treba vratiti status 400 i tekst o gresci', function(done) {
        let imeBackup = student.ime;
        student.ime = '';
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('Greska: Niste unijeli ime!')
                student.ime = imeBackup;
                done();
            })
    })

    it('JMBG ne odgovara datumu rodjenja, treba vratiti status 400 i tekst o gresci', function(done) {
        let jmbgBackup = student.jmbg;
        student.jmbg = '1207993561426';
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('JMBG i datum rodjenja se ne poklapaju')
                student.jmbg = jmbgBackup;
                done();
            })
    })

    it('Nevalidan format JMBG, treba vratiti status 400 i tekst o gresci', function(done) {
        let jmbgBackup = student.jmbg;
        student.jmbg = '1207993561426123';
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('Greska: Format JMBG nije dobar!')
                student.jmbg = jmbgBackup;
                done();
            })
    })

    it('Podaci izvan opsega, treba vratiti status 400 i tekst o gresci', function(done) {
        let imeBackup = student.ime;
        student.ime = 'test123456789test123456789test123456789test123456789test123456789test123456789test123456789test123456789';
        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('Greska: Uneseni podaci su predugi')
                student.ime = imeBackup;
                done();
            })
    })

    it('Datum , treba vratiti status 400 i tekst o gresci', function(done) {
        let datumBackup = student.datum;
        let tmpGod = (new Date().getFullYear() + 1).toString();
        student.datum = student.datum.replace(/^.{4}/g,tmpGod);

        chai.request(app)
            .post('/api/korisnik/AddNewAssistant')
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.text.should.equal('Neispravan datum rodjenja!')
                student.datum = datumBackup;
                done();
            })
    })
})