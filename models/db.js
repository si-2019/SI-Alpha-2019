const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_IP,
    dialect: "mysql",
    logging: false,
    port: 3306,
    define: {
        timestamps: false
    }
});
const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Korisnik = sequelize.import(__dirname + '/Korisnik.js');
db.Odsjek = sequelize.import(__dirname + '/Odsjek.js');
db.Predmet = sequelize.import(__dirname + '/Predmet.js');
db.Ispit = sequelize.import(__dirname + '/Ispit.js');
db.odsjek_predmet = sequelize.import(__dirname + '/odsjek_predmet.js');


module.exports = db;
