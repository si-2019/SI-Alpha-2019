const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/POST PromoteStudentToAssistant', () => {
    
    it('Nedostaje parametar id u bodyu - treba vratiti status 400 i poruku o gresci', function(done) {        
        chai.request(app)
            .post('/api/korisnik/promoteStudentToAssistant')
            .send()
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Nije unesen id!')
                done();
            })
    })

    it('Predugacak id - treba vratiti status 400 i poruku o gresci', function(done) {        
        chai.request(app)
            .post('/api/korisnik/promoteStudentToAssistant')
            .send({id: 123456789123})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Uneseni id je predugacak!')
                done();
            })
    })

    it('Student sa unesenim id ne postoji - treba vratiti status 400 i poruku o gresci', function(done) {        
        chai.request(app)
            .post('/api/korisnik/promoteStudentToAssistant')
            .send({id: 36})
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                res.body.message.should.equal('Student sa unesenim Id-em ne postoji u sistemu!')
                done();
            })
    })    
})