const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();


describe('/POST AddNewProfessor', () => {
    let prof = {
        idOdsjek:'TK',
        ime:'Semso',
        prezime:'Levic',
        datumRodjenja:'1995-05-13',
        JMBG:'1305995175070',
        email:'malalala.com',
        mjestoRodjenja:'Travnik',
        kanton:'SBK',
        drzavljanstvo:'BiH',
        telefon:'062/033-033',
        spol:'musko',
        imePrezimeMajke:'Fatima Aktic',
        imePrezimeOca: 'Meho Amsovic',
        adresa:'Gornja Maoca',
        username:'amer.pasic2',
        linkedin:'prof.com',
        website:'prof_muha.com',
        titula:'red'
    };

    it('Uspjesno dodavanje, treba vratiti status 200', function(done) {        
        chai.request(app)
            .post('/api/korisnik/AddNewProfessor')
            .send(prof)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
    })

    it('Greska 400, ime prazno', function(done) {      
        let imee = prof.ime;
        prof.ime = '';  
        chai.request(app)
            .post('/api/korisnik/AddNewProfessor')
            .send(prof)
            .end((err, res) => {
                res.should.have.status(400);
                expect(res.body.message).should.equal('Greska: Niste unijeli ime!')
                prof.ime = imee;
                done();
            })
    })

    it('Varaca 4, datum se ne poklapa sa jmbg', function(done) {     
        let datum = prof.datumRodjenja;
        prof.datumRodjenja = '1999-02-02'   
        chai.request(app)
            .post('/api/korisnik/AddNewProfessor')
            .send(prof)
            .end((err, res) => {
                res.should.have.status(400)
                prof.datumRodjenja = datum;
                done();
            })
    })
});
/*
describe('Testiranje get  /api/korisnik/GetLoginDataForProfessor', function() {
    it('Greska jer prezime nije uneseno', function(done) {
        chai.request(app)
        .get('/api/korisnik/GetLoginDataForProfessor')
        .query({ ime: 'Zlata', prezime: ''})
        .end(function(err,res){
            res.should.have.status(400);
            res.should.be.json;
            expect(res.body.message).to.equal('Unesite ime/prezime');
            done();
        });
    });
});*/