const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const exepect = chai.expect

chai.use(chaiHttp);
chai.should();

describe('/GET GetPredmeti', () => {
	it('Treba vratiti sve predmete iz baze', function(done) {
		chai.request(app)
			.get('/api/predmet/GetPredmeti')
			.end((err, res) => {
				res.should.have.status(200)
				if(!res.body){
					res.body.should.be.a('object')
				}
				else if (Array.isArray(res.body)){
					res.body.should.be.a('Array')
					res.body[0].should.have.property('naziv')
				}
				else{
					res.body.should.be.a('object')
					res.body.should.have.property('naziv')
				}
				done();
			})
	})
})