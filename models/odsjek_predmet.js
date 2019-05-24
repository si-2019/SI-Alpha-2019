const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    return sequelize.define("Predmet",{
		idOdsjek: {
			type: DataTypes.INTEGER(10),
			allowNull: false
		},
        idPredmet:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		semestar:{
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		godina:{
			type: Sequelize.INTEGER(1),
			allowNull: true
		},
		obavezan:{
			type: DataTypes.INTEGER(1),
			allowNull: true
		}
    },{
		tableName: 'odsjek_predmet'
	})
};