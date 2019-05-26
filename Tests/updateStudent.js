const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST updateStudent', () => {
    let student = {
        id: 1,
        ime: 'Mario',
        prezime: 'Tukovic'        
    };
    let ruta = '/api/korisnik/updateStudent';
    
    it('Upjesno azuriranje, treba vratiti status 200', function(done) { 
           
        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => { 
                res.should.have.status(200)
                res.body.should.have.property("message")
                res.body.message.should.equal("Student uspjesno azuriran!")
                done();
            })
    })
    
    it('Nedostaje parametar prezime, treba vratiti status 400 i tekst o gresci', function(done) {
        student.prezime = '';

        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nisu uneseni svi obavezni podaci!')
                student.prezime = 'Tukovic';
                done();
            })
    })
    
    
    it('Nedostaje parametar ime, treba vratiti status 400 i tekst o gresci', function(done) {
        student.ime = '';
            
        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nisu uneseni svi obavezni podaci!')
                student.ime = 'Mario';
                done();
            })
    })
    
    it('Nepostojeci student, treba vratiti status 400 i tekst o gresci', function(done) {
        student.ime = "Sabina";
        student.prezime = "Zoric";
        student.id = 41;
        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Odabrani student ne postoji!')
                student.id = 1;
                done();
            })
    })

    it('Nije poslan id, treba vratiti status 400 i tekst o gresci', function(done) {
        student.id = null;
        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Nije poslan id!')
                student.id = 1;
                done();
            })
    })

    it('Podaci izvan opsega, treba vratiti status 400 i tekst o gresci', function(done) {
        student.ime = 'mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11mario11';
        chai.request(app)
            .post(ruta)
            .send(student)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.have.property("message");
                res.body.message.should.equal('Podaci su predugacki!')
                student.ime = 'Mario';
                done();
            })
    }) 
}) 