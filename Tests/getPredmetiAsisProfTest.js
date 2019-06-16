const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();
var today = new Date();
var naziv = 'Test' + today.getHours() + today.getMinutes() + today.getSeconds();
var Profesor;
var Predmet;

describe('/GET getPredmetiAsisProf', () => {
	let profesor = { 
            "idOdsjek": "RI",
            "ime": "Mahrama",
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
            "username": "mahrama.karac1",
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
                //expect(res.body.message).to.equal("Uspješno dodan profesor")
                done();
            })
    })
	
	it('Vraca 200 i json objekat za pretragu po usernameu', function(done) {
    chai.request(app)
    .get('/api/korisnik/searchProfessor')
    .query({username: 'mahrama.karac1'})
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .end((err, res) => {
        res.should.have.status(200);
		Profesor = res.body;
        //expect(res.body).to.deep.equal(json);
        done();
    })
})
	
	it('Treba se unijeti predmet u bazi podataka', function(done) {
		chai.request(app)
			.post('/api/predmet/AddNewPredmet')
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({
				naziv: naziv,
				ects: 5,
				brojPredavanja: 20,
				brojVjezbi: 10,
				opis: 'Predmet napravljen u svrhi testiranja'
			})
			.end((err, res) => {
				res.should.have.status(200)
				Predmet = res.body;
                res.body.should.be.a('object')
				res.body.should.have.property('naziv')
                res.body.should.have.property('ects')
                res.body.should.have.property('opis')
				done();
			})
	})
	
	it('Uspjesno povezan predmet-profesor', function(done) {
        chai.request(app)
        .post('/api/povezivanje/linkProfessorSubject')
        .send({
			idPredmet: Predmet.id.toString(),
			idProfesor: Profesor[0].id.toString()
		})
        .end((err, res) => {
            res.should.have.status(200)
            done();
        })
    })
		
	it('Treba vratit status 200 i obirsati unesenog profesora', function(done) {
        chai.request(app)
        .delete('/api/unos/izbrisatProfesora')
        .query({username:'mahrama.karac1'})
        .end((err,res) => {
            res.should.have.status(200);
            done();
        })
    })
	
	it('Brise se predmet iz baze', function(done) {
		chai.request(app)
			.delete('/api/predmet/deleteSubject?naziv=' + encodeURIComponent(naziv))
			.set('content-type', 'application/x-www-form-urlencoded')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.have.property('message')
				done();
			})
	})
})
