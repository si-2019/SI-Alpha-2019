const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();
//ime, prezime,username, ime i prezime , greska
var json = [
    {
        "id": 2,
        "odsjek": "RI",
        "ime": "Emira",
        "prezime": "Zukic",
        "datumRodjenja": "2015-12-17",
        "JMBG": "1212994186525",
        "email": "emiraz@gmail.com",
        "mjestoRodjenja": "Tuzla",
        "kanton": "TK",
        "drzavljanstvo": "BiH",
        "telefon": "062999999",
        "spol": true,
        "imePrezimeMajke": "Emirina majka",
        "imePrezimeOca": "Emirin Otac",
        "adresa": "NovaAdresa",
        "username": "ezukic2",
        "linkedin": "http://www.linked.com/ezukic2",
        "website": "www.ezukic.com",
        "titula": "Student"
    }
]

describe('GET /searchStudent', () => {

it('Vraca 400 i poruku da nema tog studenta', function(done) {
    chai.request(app)
    .get('/api/korisnik/searchStudent')
    .query({ime: 'Emir123'})
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