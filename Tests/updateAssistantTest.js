const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST UpdateAssistant', () => {
    let asistent = {
        id: 237,
        ime: 'Sabina',
        prezime: 'Dacic'        
    };
    
    it('Basic case - uspjesno azuriranje, treba vratiti status 200', function(done) {        
        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property("message")
                res.body.message.should.equal("Asistent uspjesno azuriran!")
                done();
            })
    })
    
    it('Nedostaje parametar prezime, treba vratiti status 400 i tekst o gresci', function(done) {
        asistent.prezime = '';

        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nisu uneseni svi obavezni podaci!')
                asistent.prezime = "Dacic";
                done();
            })
    })
    
    
    it('Nedostaje parametar ime, treba vratiti status 400 i tekst o gresci', function(done) {
        asistent.ime = '';
            
        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nisu uneseni svi obavezni podaci!')
                asistent.ime = "Sabina";
                done();
            })
    })
    
    it('Nepostojeci asistent, treba vratiti status 400 i tekst o gresci', function(done) {
        asistent.ime = "Sabina";
        asistent.prezime = "Dacic";
        asistent.id = 1;
        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Odabrani asistent ne postoji!')
                asistent.id = 237;
                done();
            })
    })

    it('Nije poslan id, treba vratiti status 400 i tekst o gresci', function(done) {
        asistent.id = null;
        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nije poslan id!')
                asistent.id = 237;
                done();
            })
    })

    it('Podaci izvan opsega, treba vratiti status 400 i tekst o gresci', function(done) {
        asistent.ime = 'test123456789test123456789test123456789test123456789test123456789test123456789test123456789test123456789';
        chai.request(app)
            .post('/api/korisnik/updateAssistant')
            .send(asistent)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Podaci su predugacki!')
                asistent.ime = 'Sabina';
                done();
            })
    }) 
})