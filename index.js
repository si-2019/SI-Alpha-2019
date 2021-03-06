const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); 
const fs = require('fs');
const cors = require('cors');
dotenv.config();        
const swaggerDoc = require('./swaggerDoc.js');             

const app = express();
const PORT = process.env.PORT || 31901;
//app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: true }));

app.use('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({origin: '*'}));

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
