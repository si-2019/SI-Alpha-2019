const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

/*
var encode = "odsjek:TK&ime:Rasim&prezime:Kasupovics&datumRodjenja:1993-04-30&JMBG:3004993175070&email:malalala.com"+
"mjestoRodjenja:Travnik&kanton:SBK&drzavljanstvo:BiH&telefon:062/033-033&spol:0&imePrezimeMajke:Fatima Aktic"+
"imePrezimeOca: Meho Amsovic&adresa:Gornja Maoca&username:amer.pasic2&linkedin:prof.com&website:prof_muha.com&titula:red"*/

describe('PUT /editProfessor', function()  {
    let prof = {
        odsjek:'TK',
        ime:'Semsudin',
        prezime:'Kasupovics',
        datumRodjenja:'1993-04-30',
        JMBG:'3004993175070',
        email:'malalala.com',
        mjestoRodjenja:'Travnik',
        kanton:'SBK',
        drzavljanstvo:'BiH',
        telefon:'062/033-033',
        spol:0,
        imePrezimeMajke:'Fatima Aktic',
        imePrezimeOca: 'Meho Amsovic',
        adresa:'Gornja Maoca',
        username:'amer.pasic2',
        linkedin:'prof.com',
        website:'prof_muha.com',
        titula:'red'
    };
    it('Vraca 200 i poruku o uspjesnom azuriranju informacija', function(done) {
        chai.request(app)
        .put('/api/korisnik/editProfessor') 
        .send(prof)            
        .set('Content-Type','application/x-www-form-urlencoded')
        .then((err, res) => {
           // console.log( err);
           // console.log('Odgovor'+ res);
           // should.exist(res.body);
            res.should.have.status(200);
           /* res.body.should.have.property('message');
            res.body.should.be.a('object');
            expect(res.body.message).to.equal('Uspjesno azurirane informacije o profesoru');*/
           done();
        }).catch(done);
    })

})