const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Plan = require('./Plan')

const Place = db.define('place', {
	day: {
		type: DataTypes.TINYINT,
		allowNull: false
	},
	idx: {
		type: DataTypes.TINYINT,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lat: {
		type: DataTypes.DOUBLE,
		allowNull: false
	},
	lng: {
		type: DataTypes.DOUBLE,
		allowNull: false
	},
	place_id: {
		type: DataTypes.STRING,
		allowNull: false
	},
	formatted_address: {
		type: DataTypes.STRING,
		allowNull: false
	}
})
// Place belongs to plan (1:N)
Plan.hasMany(Place)
Place.belongsTo(Plan, { onDelete: 'CASCADE' })

module.exports = Place
