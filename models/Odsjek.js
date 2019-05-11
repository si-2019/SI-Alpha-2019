const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    return sequelize.define("Odsjek",{
		idOdsjek: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
        naziv:{
			type: Sequelize.STRING(25),
			allowNull: true
		}
    },{
		tableName: 'Odsjek'
	})
};