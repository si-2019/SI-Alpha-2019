const db = require('../models/db.js');
db.sequelize.sync();
module.exports = function(){
    validacijaStringova = function(body) {
        if(body.ime.length > 50 || body.prezime.length > 50 || body.email.length > 50 || body.mjestoRodjenja.length > 50 || body.kanton.length > 50 || body.drzavljanstvo.length > 50 || body.telefon.length > 50) return 'Polja koja nisu JMBG i ime na smiju biti duza od 50 znakova';
        else if(body.JMBG.length > 13) return 'JMBG ne smije biti duzi od 13 znakova';
        else if(body.imePrezimeMajke.length > 100 || body.imePrezimeOca.length > 100) return 'Imena roditelja ne smiju biti duza od 100 znakova';
        else if(body.adresa.length > 50 || body.linkedin.length > 50 || body.website.length > 50 || body.titula.length > 50 ) return 'Polja koja nisu JMBG i ime na smiju biti duza od 50 znakova';
        return 'Ok';
        },  
    validacijaDatumaRodjenja = function(datum) {
        var dns = new Date();
        if (datum.substring(0,4) > dns.getFullYear()) return false;
        else if (datum.substring(5,7) > dns.getMonth() && dns.getFullYear() == datum.substring(0,4)) return false;
        else if (datum.substring(8,10) > dns.getDay() && datum.substring(5,7) == dns.getMonth() && dns.getFullYear() == datum.substring(0,4)) return false;
        return true;
    },
    provjeriDatumJmbg = function(datum,jmbg) {
        var day = jmbg.substring(0, 2);
        var month = jmbg.substring(2, 4);
        var year = jmbg.substring(4, 7);
        
        if (year.substring(0, 1) != "0") year = "1" + year;
        else year = "2" + year;
       // if (day.substring(0, 1) == "0") day = day.substring(1, 2);
       // if (month.substring(0, 1) == "0") month = month.substring(1, 2);
        
        if (parseInt(day) == datum.substring(8,10) && parseInt(month) == datum.substring(5,7) && parseInt(year) == datum.substring(0,4)) return true;
        return false;
    },
    validacijaPodataka = function(body) {
        console.log('jel sta null'+body.email+body.mjestoRodjenja+body.drzavljanstvo+body.telefon+body.imePrezimeMajke+body.imePrezimeOca+body.adresa+body.titula);
        var regexJMBG = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])[0-9]{9}$/m;
        var validno = regexJMBG.test(body.JMBG);
        if(validno == false) return 'Format JMBG nije dobar!';
        else if(!body.ime) return 'Niste unijeli ime!';
        else if(!body.prezime) return 'Niste unijeli prezime!';
        else if( !body.email || !body.mjestoRodjenja || !body.drzavljanstvo || !body.telefon || !body.imePrezimeMajke || !body.imePrezimeOca || !body.adresa || !body.titula) return 'Popunite sva polja';
        return 'Ok';
            
    }

};