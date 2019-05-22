const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/GET GetOdsjeci', () => {
	it('Treba se vratiti svi odsjeci u baze', function(done) {
		chai.request(app)
			.get('/api/odsjek/GetOdsjeci')
			.end((err, res) => {
				res.should.have.status(200)
                res.body.should.be.a('Array')
				res.body[0].should.have.property('naziv')
				res.body[0].naziv.should.include("RI")
				res.body[1].naziv.should.include("AIE")
				res.body[2].naziv.should.include("EE")
				res.body[3].naziv.should.include("TK")
				done();
			})
	})
})