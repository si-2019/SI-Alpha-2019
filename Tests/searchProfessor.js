const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();
//ime, prezime,username, ime i prezime , greska
var json = [
    {
        "id": 36,
        "odsjek": "RI",
        "ime": "Almir",
        "prezime": "Karabegović",
        "datumRodjenja": "1975-06-22",
        "JMBG": "2206975842818",
        "email": "almir.karabegovic@etf.unsa.ba",
        "mjestoRodjenja": "Zenica",
        "kanton": "Zeničko-Dobojski kanton",
        "drzavljanstvo": "BiH",
        "telefon": "+38761525926",
        "spol": false,
        "imePrezimeMajke": "Fatima Marić",
        "imePrezimeOca": "Nesib Karabegović",
        "adresa": "Zmaja od Bosne 29",
        "username": "almir.karabegovic1",
        "linkedin": "https://ba.linkedin.com/in/almir",
        "website": null,
        "titula": null
    }
]

describe('GET /searchProfessor', () => {

it('Vraca 400 i poruku da nema tog profesora', function(done) {
    chai.request(app)
    .get('/api/korisnik/searchProfessor')
    .query({ime: 'Zlata'})
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('message');
        res.body.should.be.a('object');
        expect(res.body.message).to.equal('Ne postoji u sistemu');
        done();
    })
})

})