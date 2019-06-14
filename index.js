const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); 
const fs = require('fs');
dotenv.config();        
const swaggerDoc = require('./swaggerDoc.js');             

const app = express();
const PORT = process.env.PORT || 31901;
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

swaggerDoc(app);

const Folder = './Routes/';

fs.readdir(Folder, (err, files) => {
  files.forEach(file => {
	var Path = require("path").join(__dirname, Folder + file +"/");
	require("fs").readdirSync(Path).forEach(function(file2) {
		app.use('/api/' + file.toLowerCase(), require(Folder + file + "/" + file2));
	});
  });
});

const db = require ('./models/db.js');
db.sequelize.sync()
    .then(() => console.log("Uspjesno povezivanje sa bazom!"))
    .catch((err) => console.log("Povezivanje sa bazom nije uspjelo!", err));

app.listen(PORT, () => {
    console.log(`Rest-api service started on ${PORT} port!`);
});

module.exports = app;
