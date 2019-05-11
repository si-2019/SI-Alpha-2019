const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    return sequelize.define("Predmet",{
		id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
        idAsistent:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		idProfesor:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		naziv:{
			type: Sequelize.STRING(255),
			allowNull: true
		},
		ects:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		brojPredavanja:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		brojVjezbi:{
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		opis:{
			type: Sequelize.STRING(1024),
			allowNull: true
		}
    },{
		tableName: 'Predmet'
	})
};