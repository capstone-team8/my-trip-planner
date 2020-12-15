const { DataTypes } = require('sequelize')
const db = require('../config/database')

const Plan = db.define('plan', {
	name: {
		type: DataTypes.STRING,
		allowNull: false
    },
    days: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    isShared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
// Plan belongs to many User (M:N)
// Plan has many places (1:N)

module.exports = Plan
