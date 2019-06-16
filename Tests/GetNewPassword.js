const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/GET GetNewPassword', () => {
    it('Status 400 jer nema korisnika', function(done) {
        chai.request(app)
            .get('/api/korisnik/GetNewPassword')
            .query({username:'amer.pasic3'})
            .end((err, res) => {
                res.should.have.status(400)

                done();
            })
    })
})