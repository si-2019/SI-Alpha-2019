const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); 
dotenv.config();                   

const app = express();
const PORT = process.env.PORT || 31901;
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const korisnikRouter = require('./Routes/korisnikController');
app.use('/api/korisnik', korisnikRouter); 

const db = require ('./models/db.js');
db.sequelize.sync()
    .then(() => console.log("Uspjesno povezivanje sa bazom!"))
    .catch((err) => console.log("Povezivanje sa bazom nije uspjelo!", err));

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});

module.exports = app;