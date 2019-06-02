const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();

//dodat da obrise korisnika kojeg doda, kako bi prolazili testovi
describe('/POST AddNewProfessor', () => {
    let profesor = { 
            "idOdsjek": "RI",
            "ime": "Amela",
            "prezime": "Karac",
            "datumRodjenja": "1901-03-01",
            "JMBG": "0103901842818",
            "email": "amela.karac@etf.unsa.ba",
            "mjestoRodjenja": "Zenica",
            "kanton": "Zeničko-Dobojski kanton",
            "drzavljanstvo": "BiH",
            "telefon": "+38761525926",
            "spol": 'zensko',
            "imePrezimeMajke": "Fatima Marić",
            "imePrezimeOca": "Nesib Karać",
            "adresa": "Zmaja od Bosne 29",
            "username": "amela.karac1",
            "linkedin": "https://ba.linkedin.com/in/almir",
            "website": null,
            "titula": "red"
        }
        let ruta = '/api/korisnik/AddNewProfessor';
    

    it('Uspjesno dodavanje profesora, treba vratiti status 200', function(done) {        
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(200)
                expect(res.body.message).to.equal("Uspješno dodan profesor")
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
                expect(res.body.message).to.equal('Niste unijeli prezime!')
                profesor.prezime = 'Karać"';
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
                expect(res.body.message).to.equal('Niste unijeli ime!')
                profesor.ime = 'Amela';
                done();
            })
    })

    it('JMBG vec postoji, treba vratiti status 400 i tekst o gresci', function(done) {
       
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                expect(res.body.message).to.equal('Postoji korisnik sa istim JMBG!')
                done();
            })
    })

   

    it('Podaci izvan opsega, treba vratiti status 400 i tekst o gresci', function(done) {
        profesor.ime = 'majatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetstmajatetst';
        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                expect(res.body.message).to.equal('Uneseni podaci su duzi od 50 znakova')
                profesor.ime = 'Amela';
                done();
            })
    })

    it('Datum , treba vratiti status 400 i tekst o gresci', function(done) {
        let datumBackup = profesor.datumRodjena;
        let tmpGod = (new Date().getFullYear() + 1).toString();
        profesor.datumRodjenja = profesor.datumRodjenja.replace(/^.{4}/g,tmpGod);

        chai.request(app)
            .post(ruta)
            .send(profesor)
            .end((err, res) => {
                res.should.have.status(400)
                expect(res.body.message).to.equal('Neispravan datum rodjenja!')
                profesor.datumRodjenja = datumBackup;
                done();
            })
    })
})