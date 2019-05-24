const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();
//ime, prezime,username, ime i prezime , greska
var json = [
    {
        "id": 41,
        "odsjek": "RI",
        "ime": "Marina",
        "prezime": "Milicevic",
        "datumRodjenja": "1993-07-17",
        "JMBG": "1707993416592",
        "email": "marinam.milicevic@gmail.com",
        "mjestoRodjenja": "Tuzla",
        "kanton": "Tuzlanski kanton",
        "drzavljanstvo": "BiH",
        "telefon": "+38733641513",
        "spol": false,
        "imePrezimeMajke": "Selma Malagić",
        "imePrezimeOca": "Damir Milićević",
        "adresa": "Sutjeska 21",
        "username": "mmilicevic1",
        "linkedin": "https://ba.linkedin.com/in/marina",
        "titula": null,
        "website": null
    }
]

describe('GET /searchAssistant', () => {

    it('Vraca 400 i poruku da nema tog asistenta', function(done) {
        chai.request(app)
        .get('/api/korisnik/searchAssistant')
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

    //uloga mora biti broj 2 (asistent)
    it('Vraca 200 i json objekat za pretragu po imenu', function(done) {
        chai.request(app)
        .get('/api/korisnik/searchAssistant')
        .query({ime: 'Marina'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal(json);
            done();
        })
    })

    it('Vraca 200 i json objekat za pretragu po prezimenu', function(done) {
        chai.request(app)
        .get('/api/korisnik/searchAssistant')
        .query({prezime : 'Milicevic'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal(json);
            done();
        })
    })

    it('Vraca 200 i json objekat za pretragu po usernameu', function(done) {
        chai.request(app)
        .get('/api/korisnik/searchAssistant')
        .query({username: 'mmilicevic1'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal(json);
            done();
        })
    })

    it('Vraca 200 i json objekat za pretragu po imenu i prezimenu', function(done) {
        chai.request(app)
        .get('/api/korisnik/searchAssistant')
        .query({ime: 'Marina', prezime : 'Milicevic'})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.equal(json);
            done();
        })
    })
})